// Envío de los formularios de contacto y de dossier. Dos vías, la que esté
// configurada en las variables de entorno del servidor: Resend
// (RESEND_API_KEY) o SMTP de Gmail con contraseña de aplicación
// (GMAIL_USER + GMAIL_APP_PASSWORD). Ninguna credencial sale del servidor.
// El alta de inversores usa su propio envío (app/alta-inversores/lib/mailer.js).

export function mailerConfigured() {
  return Boolean(process.env.RESEND_API_KEY || (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD))
}

// `to` es el destinatario específico del formulario, si está definido
// (CONTACT_TO_EMAIL o DOSSIER_TO_EMAIL).
export async function sendFormMail({ to, subject, text, html, replyTo }) {
  if (process.env.RESEND_API_KEY) {
    const from = process.env.CONTACT_FROM_EMAIL || 'Demeter Corp Web <web@demetercorp.es>'
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to || 'info@demetercorp.es'], reply_to: replyTo, subject, text, html }),
    })
    if (!response.ok) throw new Error(`Resend: ${await response.text()}`)
    return
  }

  // Mismo buzón por defecto que el alta de inversores cuando no hay otro definido.
  const recipient = to || process.env.MAIL_TO || 'javiernovoa@demetergod.com'
  const nodemailer = (await import('nodemailer')).default
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })
  await transporter.sendMail({ from: `Grupo Demeter Web <${process.env.GMAIL_USER}>`, to: recipient, replyTo, subject, text, html })
}
