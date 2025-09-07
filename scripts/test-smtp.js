#!/usr/bin/env node
/**
 * Simple SMTP test script using nodemailer.
 * Usage (inline env):
 * SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_SECURE=false SMTP_USER=user@domain.com SMTP_PASS=pass FROM_EMAIL=no-reply@domain.com TO_EMAIL=you@domain.com node scripts/test-smtp.js
 */

import nodemailer from 'nodemailer';

async function main() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = (process.env.SMTP_SECURE || 'false') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL || user;
  const to = process.env.TO_EMAIL;

  if (!host || !port || !to) {
    console.error('Missing required env vars. Required: SMTP_HOST, SMTP_PORT, SMTP_USER (or FROM_EMAIL), SMTP_PASS, TO_EMAIL');
    process.exit(1);
  }

  // Allow forcing an IP directly or resolving IPv4 when needed
  let smtpHostToUse = process.env.SMTP_HOST_IP || host;
  if (!smtpHostToUse && process.env.FORCE_IPV4 === 'true') {
    try {
      const dns = await import('dns');
      const dnsPromises = dns.promises || dns;
      const addrs = await dnsPromises.resolve4(host).catch(() => []);
      if (addrs && addrs.length) smtpHostToUse = addrs[0];
    } catch (e) {
      // ignore and fallback to host
    }
  }

  if (!smtpHostToUse) smtpHostToUse = host;
  console.log('Using SMTP host:', smtpHostToUse, 'port:', port, 'secure:', secure);

  const transporter = nodemailer.createTransport({
    host: smtpHostToUse,
    port,
    secure,
    auth: user ? { user, pass } : undefined,
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'SMTP test desde scripts/test-smtp.js',
      text: 'Este es un correo de prueba enviado con nodemailer usando las variables de entorno proporcionadas.',
    });
    console.log('Mensaje enviado:', info.messageId || info.response || info);
    process.exit(0);
  } catch (err) {
    console.error('Error enviando:', err);
    process.exit(2);
  }
}

main();
