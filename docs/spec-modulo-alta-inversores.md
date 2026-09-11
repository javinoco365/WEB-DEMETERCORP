# Módulo de alta de inversores — especificación funcional

Especificación funcional, no técnica. La implementación (estructura de carpetas, despliegue) se decide según cómo esté montado el proyecto en cada momento. Los textos marcados como literales no se reescriben: están pensados para un inversor profesional, no son texto de relleno.

## Historial de decisiones

La especificación original (recibida el 2026-09-11) planteaba guardar cada alta en una tabla Supabase con políticas RLS, revisarlas desde un panel privado autenticado, y publicar el formulario en un despliegue de Vercel independiente sobre `inversores.demetercorp.es`. Ese mismo día, antes de empezar a construir y ya con el formulario funcionando en local, se decidió con el cliente sustituir esas piezas, en dos momentos:

**Primera decisión — antes de escribir código:**
- **Sin Supabase.** No hay tabla, no hay políticas RLS que verificar.
- **Sin panel.** No se construye ninguna sección de revisión autenticada.
- **Entrega: email directo**, en vez de base de datos. El correo llega formateado campo por campo, con los vacíos marcados como `NO CONSTA`, para servir directamente como ficha de inversor.

**Segunda decisión — tras terminar el formulario en local:**
- **Sin Resend.** El cliente no tiene cuenta en Resend ni quiere crear una. El envío se hace por **SMTP de Gmail** (librería `nodemailer`), usando la cuenta de Gmail del cliente como remitente técnico. Sin alta en ningún servicio nuevo.
- **Sin despliegue independiente.** El formulario no vive en un proyecto de Vercel aparte ni en `inversores.demetercorp.es`. Se integra como una página más del sitio corporativo ya existente (`demetercorp.es/alta-inversores`), dentro del mismo proyecto de Vercel, compartiendo el menú y el pie de página del resto de la web. La regla de aislamiento del despliegue (sin menú, sin enlaces, subdominio propio, variables de entorno mínimas) **queda sin efecto** — el cliente prefirió simplicidad sobre aislamiento.
- La página conserva `noindex` en sus metadatos: no está pensada para tráfico de búsqueda, se comparte por enlace directo con `?origen=` y `?enviado_por=`.

**Tercera decisión — tras la primera prueba real en producción (correo recibido correctamente):**
- **Formulario corto, una sola pantalla.** El wizard de 7 pasos / 27 campos resultaba demasiado largo. Se sustituye por un formulario de **9 campos en una única pantalla, sin pasos ni barra de progreso**: nombre y apellidos, email, teléfono, qué busca ahora, tipologías, zonas donde compra, importe máximo de inversión, qué le hace descartar una operación (ahora opcional, ya no obligatorio) y cómo prefiere que le avisemos. El resto de los 27 campos originales se elimina del formulario (no se pregunta, no llega en el correo). El campo "Ticket" (rango por tramos) se sustituye por un **slider** de importe máximo de inversión (0 a 25 M€, pasos de 50.000 €) con el valor en euros a la vista en tiempo real.
- Sigue enviándose por email con el mismo mecanismo (SMTP de Gmail), con los campos formateados uno por uno y los vacíos como `NO CONSTA`.

El resto de la especificación original que sigue vigente —los textos literales, el comportamiento del formulario (guardado de progreso, validación por campo, honeypot, límite por IP) y el diseño— se mantiene. Este documento ya incorpora todos los cambios; no hace falta leer ninguna versión anterior. La lista de 27 campos original queda como referencia histórica más abajo, pero **el formulario real hoy solo usa los 9 campos de la tercera decisión**.

**Valores confirmados** (ya no hay placeholders pendientes):
- Ruta del formulario: `demetercorp.es/alta-inversores` (página dentro del sitio corporativo, no un subdominio propio)
- Dirección de destino de cada alta: `javiernovoa@demetergod.com`
- Correo de contacto para ejercicio de derechos GDPR (en el aviso de consentimiento): `info@demetercorp.es`
- Remitente técnico del correo: la cuenta de Gmail del cliente (variables `GMAIL_USER` / `GMAIL_APP_PASSWORD`)

## Qué hay que construir

Un formulario de alta de inversores para Grupo Demeter, publicado en `demetercorp.es/alta-inversores`, que al enviarse remite un correo con la respuesta completa a `javiernovoa@demetergod.com`.

## Cómo se entrega cada respuesta

- El envío del formulario llega a una API route de servidor (no se llama a ningún servicio externo desde el navegador).
- Esa API route compone un correo de texto, campo por campo en el mismo orden que la especificación, con los campos vacíos marcados como `NO CONSTA`, y lo envía por SMTP de Gmail (`nodemailer`) a `javiernovoa@demetergod.com`.
- El correo también incluye los campos de contexto: `origen` y `enviado_por` (leídos de los parámetros de la URL con la que el inversor abrió el formulario), la fecha y hora de envío, y si aceptó el consentimiento.
- `GMAIL_USER` y `GMAIL_APP_PASSWORD` viven solo en las variables de entorno del servidor. Nunca se exponen al navegador ni forman parte del bundle público. El remitente que verá el destinatario es esa misma cuenta de Gmail (Gmail no permite falsear el remitente sin configurar un alias "enviar como").
- Límite de envíos por IP en la propia API route, best-effort (en memoria, se reinicia en cada cold start) combinado con un campo trampa oculto (honeypot). Sin captcha.
- No hay almacenamiento propio: si el correo no llega, la respuesta se pierde. Aceptado como riesgo dado que se prescinde de base de datos.

## Direcciones

- Formulario: `demetercorp.es/alta-inversores`

## Campos del formulario actual

Una sola pantalla, sin pasos. Los marcados con `*` son obligatorios.

1. **Nombre y apellidos** * — texto
2. **Email** * — email, validado
3. **Teléfono** * — texto
4. **Qué busca ahora** * — una opción: Comprar en renta / Comprar para reformar y vender / Comprar suelo para desarrollar / Vender activos propios / Entrar como socio / Varias
5. **Tipologías** — varias: Vivienda / Edificio completo / Local comercial / Supermercado o retail con operador / Oficinas / Naves o logística / Hotelero / Residencias de mayores / Suelo urbano / Suelo rústico / Garajes y trasteros / Otro
6. **Zonas donde compra** * — texto largo. Ayuda: *"Cuanto más concreto mejor, 'Andalucía' y 'Huelva capital' nos llevan a mandarle cosas distintas."*
7. **Importe máximo de inversión** * — slider, 0 a 25.000.000 €, pasos de 50.000 €, valor por defecto 500.000 €. Se muestra formateado en euros en tiempo real; al llegar al máximo se indica "25.000.000 €+".
8. **Qué le hace descartar una operación de entrada** — texto largo, opcional. Ayuda: *"Si sabemos qué no quiere ver, no se lo mandamos."*
9. **Cómo prefiere que le avisemos** — una opción: Llamada / WhatsApp / Email

Más la casilla de **consentimiento** (obligatoria, ver más abajo).

### Campos originales (27), fuera de uso — referencia histórica

La especificación inicial pedía siete pasos con estos 27 campos; se conservan aquí solo como referencia de lo que se descartó en la tercera decisión, no describen el formulario actual.

### Paso 1 — Presentación

Sin campos.

- Título: **"Cuéntenos qué busca"**
- Texto: *"Trabajamos operaciones off-market y en exclusiva; antes de enviarle nada queremos saber qué compra exactamente, para no ocuparle tiempo con activos que no le encajan. Cinco minutos."*

### Paso 2 — Quién es usted

1. **Nombre y apellidos** * — texto
2. **Empresa o sociedad con la que invierte** — texto
3. **Email** * — email, validado
4. **Teléfono** * — texto
5. **Perfil** * — una opción: Inversor particular / Family office / Sociedad patrimonial / Promotor / Fondo de inversión / SOCIMI / Operador del sector / Grupo de inversores
6. **Qué busca ahora** * — una opción: Comprar en renta / Comprar para reformar y vender / Comprar suelo para desarrollar / Vender activos propios / Entrar como socio / Varias

### Paso 3 — Tipo de activo

7. **Tipologías** * — varias: Vivienda / Edificio completo / Local comercial / Supermercado o retail con operador / Oficinas / Naves o logística / Hotelero / Residencias de mayores / Suelo urbano / Suelo rústico / Garajes y trasteros / Otro
8. **Matices dentro de esas tipologías** — texto largo
9. **Zonas donde compra** * — texto largo. Ayuda: *"Cuanto más concreto mejor, 'Andalucía' y 'Huelva capital' nos llevan a mandarle cosas distintas."*
10. **Zonas donde no compra** — texto
11. **Población mínima** — una opción: No, depende del activo / +20.000 / +50.000 / +100.000 / Solo capitales

### Paso 4 — Volumen

12. **Ticket** * — una opción: Hasta 300.000 € / 300.000–1 M€ / 1–3 M€ / 3–10 M€ / 10–25 M€ / Más de 25 M€
13. **Si algo se sale del rango pero encaja en lo demás, ¿se lo mandamos?** — Sí / No
14. **Fondos propios o financiación** — una opción: Fondos propios / Siempre financiación / Solo en tickets altos / Depende
15. **Cuánto mantiene un activo** — una opción: Menos de un año / 1–3 años / 3–7 años / Es patrimonio

### Paso 5 — Rentabilidad

Texto de apertura: *"Solo lo que tenga claro; si no trabaja con una cifra fija, déjelo en blanco, preferimos no saberlo a suponerlo mal."*

16. **Rentabilidad bruta mínima** — una opción: No trabajo con mínimo fijo / 4% / 5% / 6% / 7% / 8% / Más del 8%
17. **Margen mínimo si compra para revender** — texto. Condicional: solo se muestra si en el campo 6 eligió "Comprar para reformar y vender", "Comprar suelo para desarrollar", o "Varias".
18. **Descuento exigido sobre mercado** — texto

### Paso 6 — Cómo compra

19. **Tipo de operación** — varias: Alquilado y estable / Reformar para revalorizar / Reposicionar o cambiar de uso / Promover desde cero / Comprar para alquilar / Sale & leaseback / Activos con problemas a buen precio / Carteras, NPL o REO
20. **Qué asume** — varias: Activo vacío / Activo alquilado / Reforma integral / Obra parada / Problemas urbanísticos / Cargas o litigios / Inquilino con renta baja / Ocupación ilegal
21. **Cuánta obra asume** — una opción: Ninguna / Ligera / Integral / Estructural / Sin límite si el número sale
22. **Qué exige del contrato y del inquilino** — texto largo. Condicional: solo si en el campo 20 marcó "Activo alquilado".

### Paso 7 — Lo innegociable y el proceso

23. **Qué le hace descartar una operación de entrada** * — texto largo. Ayuda: *"Si sabemos qué no quiere ver, no se lo mandamos."*
24. **Qué necesita ver para decidir si la estudia** — texto largo
25. **Cuánto tarda en firmar** — una opción: <30 días / 30–60 / 60–90 / >90 / Depende de la financiación
26. **Decide solo** — una opción: Sí / Visto bueno de socios / Comité de inversión
27. **Cómo prefiere que le avisemos** — Llamada / WhatsApp / Email

### Consentimiento

Casilla obligatoria antes de enviar, con este texto encima, literal:

> Responsable: Demeter Soluciones Estratégicas, S.L. — CIF B22629844 — Calle Botticelli 1, 21450 Cartaya (Huelva). Finalidad: gestionar su perfil inversor y remitirle oportunidades que encajen con los criterios indicados. Legitimación: su consentimiento. Conservación: mientras se mantenga la relación o hasta que solicite la supresión. Destinatarios: no cedemos sus datos a terceros. Derechos: acceso, rectificación, supresión y oposición escribiendo a info@demetercorp.es.

### Pantalla final — "Recibido"

Texto: *"Gracias, a partir de ahora solo le escribiremos cuando tengamos algo que encaje con lo que nos ha contado."*

## Comportamiento

- Guarda el progreso en el propio navegador (`localStorage`) para que no se pierda si cierra a medias.
- No envía nada hasta el último paso.
- Errores de validación junto al campo, no en un aviso general arriba.
- Funciona en móvil: la mayoría lo van a abrir desde el teléfono.
- Anti-spam: campo trampa oculto (honeypot) y límite de envíos por dirección IP en la API route. Sin captcha.
- Lee `origen` y `enviado_por` de los parámetros de la URL y los incluye en el correo enviado.

## Diseño

- El wizard mantiene su propia tarjeta visual (azul principal `#0B3D63`, acento `#0079B4`, fondo claro), con estilos propios sin depender de las clases globales del sitio, para no chocar con ellas ni verse afectado si cambian.
- Vive dentro de la plantilla normal del sitio (cabecera con menú y pie de página), ya que se prescindió del aislamiento visual — ver "Historial de decisiones".
- Sobrio. El destinatario es un inversor profesional, no un usuario de una landing.

## Orden de construcción

1. Formulario funcionando en local (7 pasos, validación, guardado de progreso, envío a una API route local que solo hace `console.log` del payload). Hecho como mini-app aislada primero, luego migrado dentro del sitio corporativo — ver "Historial de decisiones".
2. API route de envío por email funcionando en local (SMTP de Gmail, correo de prueba real).
3. Integración en el sitio corporativo como `/alta-inversores`, con las variables de entorno (`GMAIL_USER`, `GMAIL_APP_PASSWORD`) añadidas al proyecto de Vercel ya existente.
4. Prueba de extremo a extremo en producción: enviar el formulario real y confirmar que el correo llega a `javiernovoa@demetergod.com` con el formato correcto.
