# Módulo de alta de inversores — especificación funcional

Especificación funcional, no técnica. La implementación (framework, estructura de carpetas, despliegue) se decide según cómo esté montado el proyecto en cada momento. Los textos marcados como literales no se reescriben: están pensados para un inversor profesional, no son texto de relleno.

> Placeholders pendientes de valor real antes de publicar — no rellenar con un valor de ejemplo, deben confirmarse:
> - `[dominio]` — dominio bajo el que vivirá `inversores.[dominio]`.
> - `[correo]` — dirección para ejercicio de derechos GDPR en el aviso de consentimiento (Paso de consentimiento).

## Qué hay que construir

Un formulario público de alta de inversores para Grupo Demeter, alojado en una dirección propia, completamente aislado del panel privado de la app, que guarda las respuestas en Supabase y las deja disponibles para revisarlas desde el panel.

## Regla de seguridad — la más importante

La página pública se sirve en el navegador del inversor, así que la clave anónima de Supabase es visible para cualquiera. Toda la seguridad depende de lo que esa clave tenga permitido hacer.

Requisitos, sin excepción:

1. La política RLS de la tabla de respuestas permite `INSERT` para el rol anónimo y nada más. Sin `SELECT`, sin `UPDATE`, sin `DELETE`.
2. Ninguna otra tabla del proyecto es accesible desde el rol anónimo.
3. La lectura de respuestas se hace solo desde el panel, con usuario autenticado.
4. **Comprobación obligatoria** antes de dar por terminado: intentar leer la tabla con la clave anónima desde fuera de la app y confirmar que devuelve vacío o error. Si devuelve filas, está mal.

## Regla de aislamiento

El despliegue público no debe revelar nada de la app interna:

- Despliegue independiente del panel, aunque compartan repositorio.
- La página pública no contiene menú, login, enlaces al panel ni referencias a rutas internas.
- No reutiliza componentes que arrastren rutas, nombres de tablas o textos del panel.
- Las variables de entorno del despliegue público incluyen únicamente la URL de Supabase y la clave anónima. Ninguna clave de servicio.
- Sin mapa del sitio, sin indexación: `noindex` en la página.

## Direcciones

- Formulario: `inversores.[dominio]`
- Panel: donde ya esté. No se toca.

## Tabla de respuestas

Nombre sugerido: `alta_inversor`

### Campos de sistema

- `id`
- `creado_en`
- `origen` (del parámetro de la URL)
- `enviado_por` (del parámetro de la URL)
- `consentimiento_aceptado` (booleano)
- `consentimiento_fecha`
- `estado_revision`: `PENDIENTE` / `PROCESADA` / `DESCARTADA` — por defecto `PENDIENTE`

### Campos del formulario

Los 27 de la sección siguiente.

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

Casilla obligatoria antes de enviar (`consentimiento_aceptado`), con este texto encima, literal:

> Responsable: Demeter Soluciones Estratégicas, S.L. — CIF B22629844 — Calle Botticelli 1, 21450 Cartaya (Huelva). Finalidad: gestionar su perfil inversor y remitirle oportunidades que encajen con los criterios indicados. Legitimación: su consentimiento. Conservación: mientras se mantenga la relación o hasta que solicite la supresión. Destinatarios: no cedemos sus datos a terceros. Derechos: acceso, rectificación, supresión y oposición escribiendo a [correo].

### Pantalla final — "Recibido"

Texto: *"Gracias, a partir de ahora solo le escribiremos cuando tengamos algo que encaje con lo que nos ha contado."*

## Comportamiento

- Guarda el progreso en el propio navegador para que no se pierda si cierra a medias.
- No envía nada hasta el último paso.
- Errores de validación junto al campo, no en un aviso general arriba.
- Funciona en móvil: la mayoría lo van a abrir desde el teléfono.
- Anti-spam: campo trampa oculto y límite de envíos por dirección IP. Sin captcha.
- Lee `origen` y `enviado_por` de los parámetros de la URL y los guarda con la respuesta.

## Diseño

- Azul principal `#0B3D63`, acento `#0079B4`, fondo claro.
- Logo de Demeter en la cabecera, sin enlazar a ningún sitio.
- Sobrio. El destinatario es un inversor profesional, no un usuario de una landing.

## En el panel

Una sección nueva, solo para usuarios autenticados:

- Lista de altas recibidas, las pendientes primero.
- Ficha de cada respuesta con todos los campos.
- Cambiar estado a `PROCESADA` o `DESCARTADA`.
- Botón que copia la respuesta como texto plano, campo por campo, con los vacíos marcados como `NO CONSTA`. Ese texto es el que se procesa después como ficha de inversor.
- Aviso por correo a javiernovoacontreras@gmail.com con cada alta nueva.

## Orden de construcción

1. Tabla y políticas RLS. Verificar que la clave anónima no puede leer.
2. Formulario público funcionando en local.
3. Sección del panel.
4. Despliegue independiente y subdominio.
5. Repetir la verificación del punto 1 ya en producción.
