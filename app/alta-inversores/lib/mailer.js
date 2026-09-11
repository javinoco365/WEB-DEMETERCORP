import nodemailer from 'nodemailer'

// Envío por SMTP de Gmail, con una contraseña de aplicación (no la contraseña
// normal de la cuenta). GMAIL_USER y GMAIL_APP_PASSWORD viven solo en las
// variables de entorno del servidor de este despliegue, nunca en el navegador.

let transporter

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }
  return transporter
}

export function isMailerConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
}

export async function sendInvestorEmail({ subject, text }) {
  const to = process.env.MAIL_TO || 'javiernovoa@demetergod.com'
  await getTransporter().sendMail({
    from: `Grupo Demeter — Inversores <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
  })
}
