// API endpoint: POST /api/contact
// Supports SendGrid via SENDGRID_API_KEY or SMTP via dynamic import of nodemailer and SMTP_* env vars.

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST({ request }: { request: Request }) {
  try {
    // Ensure environment variables are loaded (helps in dev when .env wasn't picked up)
    if (!process.env.SMTP_HOST) {
      try {
        const dotenv = await import('dotenv');
        dotenv.config();
        console.log('[contact API] dotenv loaded .env');
      } catch (e) {
        // ignore if dotenv not available
      }
    }
    const data = await request.json();
    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const message = (data.message || '').trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const toEmail = process.env.TO_EMAIL || process.env.CONTACT_EMAIL || 'hola@angelcalderon.dev';
    const fromEmail = process.env.FROM_EMAIL || `no-reply@${toEmail.split('@')[1] || 'example.com'}`;
    const subject = `Nuevo mensaje desde portfolio: ${name}`;

    const html = `
      <div>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
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
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });

      if (!sgRes.ok) {
        const details = await sgRes.text();
        return new Response(JSON.stringify({ error: 'SendGrid error', details }), { status: 502 });
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Fallback: try nodemailer if available (dynamic import)
    try {
      const nodemailer = await import('nodemailer');

      // Try to resolve an IPv4 for the SMTP host and use it to avoid IPv6/localhost resolution issues
      let smtpHost = process.env.SMTP_HOST;
      try {
        const dns = await import('dns');
        const dnsPromises = (dns as any).promises || dns.promises;
        if (dnsPromises && smtpHost) {
          const addrs: string[] = await dnsPromises.resolve4(smtpHost).catch(() => []);
          if (addrs && addrs.length) smtpHost = addrs[0];
        }
      } catch (e) {
        // ignore DNS resolution errors and fallback to provided host
      }

      // Log before creating transporter so we can see values used
      console.log('[contact API] smtpHost resolved:', smtpHost, 'process.env.SMTP_HOST:', process.env.SMTP_HOST);

      const transporter = nodemailer.createTransport({
        host: smtpHost || process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: (process.env.SMTP_SECURE || 'false') === 'true',
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
        // If we connected using an IP address (smtpHost may be IPv4), set servername
        // to the original hostname so TLS SNI verification matches the certificate.
        tls: {
          servername: process.env.SMTP_HOST,
        },
      });

      // Log the host used so dev can see if it's resolving to ::1 or a real IP
      const usedHost = transporter && (transporter as any).options && (transporter as any).options.host;
      console.log('[contact API] transporter.options.host:', usedHost);

      // Verify transporter connectivity/auth before sending to provide clearer errors
      try {
        await transporter.verify();
      } catch (verifyErr: any) {
        const vDetails = String(verifyErr?.message || verifyErr);
        const vCode = verifyErr?.code || verifyErr?.errno || null;
        console.error('[contact API] transporter.verify failed:', vDetails, vCode);
        return new Response(
          JSON.stringify({ error: 'Mailer verify failed', details: vDetails, code: vCode }),
          { status: 502 }
        );
      }

      await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject,
        html,
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err: any) {
      // If nodemailer missing or failed, return helpful message with error code
      const details = String(err?.message || err);
      const code = err?.code || err?.errno || null;
      return new Response(
        JSON.stringify({ error: 'No mailer available', details, code, hint: 'Set SENDGRID_API_KEY or verify SMTP_* env vars and connectivity' }),
        { status: 500 }
      );
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), { status: 500 });
  }
}
