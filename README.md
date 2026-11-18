# Demeter Corp — demetercorp.es

Web corporativa en Next.js 14. No usa WordPress. Está preparada para Vercel; los formularios envían por SMTP de Gmail o por Resend.

## Publicación recomendada
1. Comprar o administrar `demetercorp.es` en un registrador (Cloudflare Registrar, IONOS, OVH, etc.).
2. Crear una cuenta en GitHub y un repositorio privado, por ejemplo `demeter-corp-web`.
3. Subir el contenido de este proyecto al repositorio.
4. Crear una cuenta en Vercel, conectar GitHub e importar el repositorio.
5. En Vercel: Settings > Domains > añadir `demetercorp.es` y `www.demetercorp.es`.
6. Copiar en el registrador los registros DNS que indique Vercel.

## Formularios y correo
La web tiene tres formularios. Las credenciales viven solo en Vercel (Project > Settings > Environment Variables); ninguna llega al navegador. Tras cambiarlas hay que hacer Redeploy.

| Formulario | Ruta | Envío |
|---|---|---|
| Plantear un proyecto (`/contacto`) | `/api/contact` | Resend si hay `RESEND_API_KEY`; si no, SMTP de Gmail |
| Dossier de inversores (`/inversores`) | `/api/dossier` | Igual que el anterior |
| Alta de inversores (`/alta-inversores`) | `/api/alta-inversores` | Solo SMTP de Gmail |

Con `GMAIL_USER` y `GMAIL_APP_PASSWORD` funcionan los tres. Si no hay ninguna de las dos vías, contacto y dossier responden 503 con un mensaje que remite a `info@demetercorp.es`.

| Variable | Uso |
|---|---|
| `GMAIL_USER` | Cuenta de Gmail/Workspace que envía por SMTP |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación de esa cuenta (no la contraseña normal) |
| `RESEND_API_KEY` | Opcional. Si existe, contacto y dossier se envían por Resend |
| `CONTACT_FROM_EMAIL` | Remitente verificado en Resend (por defecto `Demeter Corp Web <web@demetercorp.es>`) |
| `CONTACT_TO_EMAIL` | Buzón que recibe el formulario de contacto |
| `DOSSIER_TO_EMAIL` | Buzón que recibe las solicitudes de dossier (si falta, `CONTACT_TO_EMAIL`) |
| `MAIL_TO` | Buzón del alta de inversores y destinatario de reserva de contacto y dossier por SMTP |

Destinatario por defecto si no se define ninguna variable de buzón: por Resend, `info@demetercorp.es`; por SMTP, el mismo buzón por defecto del alta de inversores (`app/alta-inversores/lib/mailer.js`).

La lógica común está en `lib/mailer.js`.


## Correo corporativo
Vercel no ofrece buzones de correo. Para que `info@demetercorp.es` exista, contratar correo con el proveedor del dominio, Google Workspace, Microsoft 365, Zoho Mail u otro proveedor y configurar sus registros MX.

## Desarrollo local
```bash
npm install
cp .env.example .env.local
npm run dev
```
Abrir http://localhost:3000

## Legal
Se incluyen páginas para Aviso legal, Privacidad y Cookies. Las plantillas por sociedad están en `/legal-templates`.
Antes de publicar, los textos deben revisarse por la asesoría jurídica del grupo y actualizarse si se incorporan nuevas herramientas de tracking, CRM, newsletter, Investor Room, mapas o vídeo.
