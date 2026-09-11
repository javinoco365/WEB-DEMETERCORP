# Demeter Corp — demetercorp.es

Web corporativa en Next.js 14. No usa WordPress. Está preparada para Vercel y un formulario de contacto que envía por Resend.

## Publicación recomendada
1. Comprar o administrar `demetercorp.es` en un registrador (Cloudflare Registrar, IONOS, OVH, etc.).
2. Crear una cuenta en GitHub y un repositorio privado, por ejemplo `demeter-corp-web`.
3. Subir el contenido de este proyecto al repositorio.
4. Crear una cuenta en Vercel, conectar GitHub e importar el repositorio.
5. En Vercel: Settings > Domains > añadir `demetercorp.es` y `www.demetercorp.es`.
6. Copiar en el registrador los registros DNS que indique Vercel.

## Formulario de contacto
El formulario envía a `info@demetercorp.es` mediante Resend.

1. Crear cuenta en Resend.
2. Añadir y verificar un dominio desde Resend > Domains. Se recomienda verificar `demetercorp.es` si ese es el dominio que se controla.
3. Crear una API key.
4. En Vercel: Project > Settings > Environment Variables añadir:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL=info@demetercorp.es`
   - `CONTACT_FROM_EMAIL=Demeter Corp Web <web@demetercorp.es>`
5. Redeploy del proyecto.


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
