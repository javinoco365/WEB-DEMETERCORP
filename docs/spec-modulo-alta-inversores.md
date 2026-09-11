# Módulo de alta de inversores — especificación funcional

Especificación funcional, no técnica. La implementación (estructura de carpetas, despliegue) se decide según cómo esté montado el proyecto en cada momento. Los textos marcados como literales no se reescriben: están pensados para un inversor profesional, no son texto de relleno.

## Historial de decisiones

La especificación original (recibida el 2026-09-11) planteaba guardar cada alta en una tabla Supabase con políticas RLS, y revisarlas desde un panel privado autenticado. Ese mismo día, antes de empezar a construir, se decidió con el cliente sustituir ambas piezas:

- **Sin Supabase.** No hay tabla, no hay políticas RLS que verificar.
- **Sin panel.** No se construye ninguna sección de revisión autenticada.
- **Entrega: email directo.** Cada envío del formulario se manda por correo, con el mismo mecanismo que ya usa el formulario de contacto de `/contacto` (Resend, vía una API route de servidor). El propio correo llega formateado campo por campo, con los vacíos marcados como `NO CONSTA`, para servir directamente como ficha de inversor.

El resto de la especificación original —los 27 campos, los textos literales, la lógica condicional, el comportamiento del formulario, el diseño y la regla de aislamiento del despliegue— se mantiene. Este documento ya incorpora esos cambios; no hace falta leer ninguna versión anterior.

**Valores confirmados** (ya no hay placeholders pendientes):
- Dominio del formulario: `inversores.demetercorp.es`
- Dirección de destino de cada alta: `javiernovoa@demetergod.com`
- Correo de contacto para ejercicio de derechos GDPR (en el aviso de consentimiento): `info@demetercorp.es`

## Qué hay que construir

Un formulario público de alta de inversores para Grupo Demeter, alojado en `inversores.demetercorp.es`, completamente aislado del resto de la web corporativa, que al enviarse remite un correo con la respuesta completa a `javiernovoa@demetergod.com`.

## Cómo se entrega cada respuesta

- El envío del formulario llega a una API route de servidor (no se llama a ningún servicio externo desde el navegador).
- Esa API route compone un correo de texto, campo por campo en el mismo orden que la especificación, con los campos vacíos marcados como `NO CONSTA`, y lo envía por Resend a `javiernovoa@demetergod.com`.
- El correo también incluye los campos de contexto: `origen` y `enviado_por` (leídos de los parámetros de la URL con la que el inversor abrió el formulario), la fecha y hora de envío, y si aceptó el consentimiento.
- La clave de Resend (`RESEND_API_KEY`) vive solo en las variables de entorno del servidor de este despliegue. Nunca se expone al navegador ni forma parte del bundle público.
- No hay almacenamiento propio: si el correo no llega, la respuesta se pierde. Aceptado como riesgo dado que se prescinde de base de datos.

## Regla de aislamiento

El despliegue público no debe revelar nada de la app interna:

- Despliegue independiente en Vercel, aunque comparta repositorio con demetercorp.es (proyecto propio, con su propio "Root Directory").
- La página pública no contiene menú, login, enlaces al resto del sitio ni referencias a rutas internas.
- No reutiliza componentes de la web corporativa que arrastren rutas, nombres internos o textos ajenos a este formulario.
- Las variables de entorno del despliegue público incluyen únicamente lo necesario para enviar el correo (`RESEND_API_KEY`, dirección de destino). Ninguna otra clave.
- Sin mapa del sitio, sin indexación: `noindex` en la página.

## Direcciones

- Formulario: `inversores.demetercorp.es`

## Campos del formulario

Siete pasos, uno por pantalla, con barra de progreso. Los marcados con `*` son obligatorios.

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

- Azul principal `#0B3D63`, acento `#0079B4`, fondo claro.
- Logo de Demeter en la cabecera, sin enlazar a ningún sitio.
- Sobrio. El destinatario es un inversor profesional, no un usuario de una landing.

## Orden de construcción

1. Formulario público funcionando en local (7 pasos, validación, guardado de progreso, envío a una API route local que solo hace `console.log` del payload).
2. API route de envío por email funcionando en local contra Resend (correo de prueba real).
3. Despliegue independiente y subdominio `inversores.demetercorp.es`, con `noindex` y solo las variables de entorno estrictamente necesarias.
4. Prueba de extremo a extremo en producción: enviar el formulario real y confirmar que el correo llega a `javiernovoa@demetergod.com` con el formato correcto.
