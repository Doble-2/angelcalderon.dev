// API endpoint: POST /api/contact
// Supports SendGrid via SENDGRID_API_KEY or SMTP via dynamic import of nodemailer and SMTP_* env vars.
// Errors returned to the client are generic codes; details are only logged on the server.

const MAX_LENGTH = { name: 100, email: 254, subject: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort rate limit (per serverless instance): 5 requests / 10 min per IP.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const field = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export async function POST({ request, clientAddress }: { request: Request; clientAddress?: string }) {
  try {
    // Ensure environment variables are loaded (helps in dev when .env wasn't picked up)
    if (!process.env.SMTP_HOST && !process.env.SENDGRID_API_KEY) {
      try {
        const dotenv = await import('dotenv');
        dotenv.config();
      } catch {
        // ignore if dotenv not available
      }
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'unknown';
    if (isRateLimited(ip)) {
      return json({ error: 'rate_limited' }, 429);
    }

    const data = await request.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      return json({ error: 'invalid_request' }, 400);
    }

    // Honeypot: real users never fill this hidden field. Pretend success for bots.
    if (field(data.website)) {
      return json({ ok: true }, 200);
    }

    const name = field(data.name);
    const email = field(data.email);
    const incomingSubject = field(data.subject);
    const message = field(data.message);

    if (!name || !email || !message) {
      return json({ error: 'missing_fields' }, 400);
    }
    if (
      name.length > MAX_LENGTH.name ||
      email.length > MAX_LENGTH.email ||
      incomingSubject.length > MAX_LENGTH.subject ||
      message.length > MAX_LENGTH.message
    ) {
      return json({ error: 'too_long' }, 400);
    }
    if (!EMAIL_RE.test(email)) {
      return json({ error: 'invalid_email' }, 400);
    }

    const toEmail = process.env.TO_EMAIL || process.env.CONTACT_EMAIL || 'hola@angelcalderon.dev';
    const fromEmail = process.env.FROM_EMAIL || `no-reply@${toEmail.split('@')[1] || 'example.com'}`;
    // Strip line breaks so user input can't inject extra mail headers.
    const safeHeader = (s: string) => s.replace(/[\r\n]+/g, ' ');
    const subject = incomingSubject
      ? `Portfolio: ${safeHeader(incomingSubject)} — ${safeHeader(name)}`
      : `Nuevo mensaje desde portfolio: ${safeHeader(name)}`;

    const html = `
      <div>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${incomingSubject ? `<p><strong>Asunto:</strong> ${escapeHtml(incomingSubject)}</p>` : ''}
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      </div>
    `;

    // Prefer SendGrid if API key is set (no extra dependency needed)
    if (process.env.SENDGRID_API_KEY) {
      const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: fromEmail },
          reply_to: { email, name },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });

      if (!sgRes.ok) {
        console.error('[contact API] SendGrid error:', sgRes.status, await sgRes.text());
        return json({ error: 'send_failed' }, 502);
      }

      return json({ ok: true }, 200);
    }

    if (!process.env.SMTP_HOST) {
      console.error('[contact API] No mailer configured: set SENDGRID_API_KEY or SMTP_* env vars');
      return json({ error: 'send_failed' }, 500);
    }

    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE || 'false') === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: { name, address: email },
      subject,
      html,
    });

    return json({ ok: true }, 200);
  } catch (err: any) {
    console.error('[contact API] Unexpected error:', err?.code || '', err?.message || err);
    return json({ error: 'send_failed' }, 500);
  }
}
