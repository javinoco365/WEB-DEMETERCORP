// Fuente única de verdad para los 27 campos del formulario de alta de inversores.
// La usan tanto el wizard (app/page.js) como la API route que formatea el email
// (app/api/enviar/route.js), así el orden y las etiquetas nunca se desincronizan.
// Ver docs/spec-modulo-alta-inversores.md en la raíz del repo para la especificación completa.

export const STEPS = [
  {
    id: 1,
    title: 'Cuéntenos qué busca',
    intro:
      'Trabajamos operaciones off-market y en exclusiva; antes de enviarle nada queremos saber qué compra exactamente, para no ocuparle tiempo con activos que no le encajan. Cinco minutos.',
    fields: [],
  },
  {
    id: 2,
    title: 'Quién es usted',
    fields: [
      { number: 1, name: 'nombre_completo', label: 'Nombre y apellidos', type: 'text', required: true },
      { number: 2, name: 'empresa', label: 'Empresa o sociedad con la que invierte', type: 'text' },
      { number: 3, name: 'email', label: 'Email', type: 'email', required: true },
      { number: 4, name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      {
        number: 5,
        name: 'perfil',
        label: 'Perfil',
        type: 'radio',
        required: true,
        options: [
          'Inversor particular',
          'Family office',
          'Sociedad patrimonial',
          'Promotor',
          'Fondo de inversión',
          'SOCIMI',
          'Operador del sector',
          'Grupo de inversores',
        ],
      },
      {
        number: 6,
        name: 'busca_ahora',
        label: 'Qué busca ahora',
        type: 'radio',
        required: true,
        options: [
          'Comprar en renta',
          'Comprar para reformar y vender',
          'Comprar suelo para desarrollar',
          'Vender activos propios',
          'Entrar como socio',
          'Varias',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Tipo de activo',
    fields: [
      {
        number: 7,
        name: 'tipologias',
        label: 'Tipologías',
        type: 'checkbox',
        required: true,
        options: [
          'Vivienda',
          'Edificio completo',
          'Local comercial',
          'Supermercado o retail con operador',
          'Oficinas',
          'Naves o logística',
          'Hotelero',
          'Residencias de mayores',
          'Suelo urbano',
          'Suelo rústico',
          'Garajes y trasteros',
          'Otro',
        ],
      },
      { number: 8, name: 'matices_tipologias', label: 'Matices dentro de esas tipologías', type: 'textarea' },
      {
        number: 9,
        name: 'zonas_compra',
        label: 'Zonas donde compra',
        type: 'textarea',
        required: true,
        help: 'Cuanto más concreto mejor, «Andalucía» y «Huelva capital» nos llevan a mandarle cosas distintas.',
      },
      { number: 10, name: 'zonas_no_compra', label: 'Zonas donde no compra', type: 'text' },
      {
        number: 11,
        name: 'poblacion_minima',
        label: 'Población mínima',
        type: 'radio',
        options: ['No, depende del activo', '+20.000', '+50.000', '+100.000', 'Solo capitales'],
      },
    ],
  },
  {
    id: 4,
    title: 'Volumen',
    fields: [
      {
        number: 12,
        name: 'ticket',
        label: 'Ticket',
        type: 'radio',
        required: true,
        options: ['Hasta 300.000 €', '300.000–1 M€', '1–3 M€', '3–10 M€', '10–25 M€', 'Más de 25 M€'],
      },
      {
        number: 13,
        name: 'fuera_rango',
        label: 'Si algo se sale del rango pero encaja en lo demás, ¿se lo mandamos?',
        type: 'radio',
        options: ['Sí', 'No'],
      },
      {
        number: 14,
        name: 'fondos',
        label: 'Fondos propios o financiación',
        type: 'radio',
        options: ['Fondos propios', 'Siempre financiación', 'Solo en tickets altos', 'Depende'],
      },
      {
        number: 15,
        name: 'permanencia',
        label: 'Cuánto mantiene un activo',
        type: 'radio',
        options: ['Menos de un año', '1–3 años', '3–7 años', 'Es patrimonio'],
      },
    ],
  },
  {
    id: 5,
    title: 'Rentabilidad',
    intro: 'Solo lo que tenga claro; si no trabaja con una cifra fija, déjelo en blanco, preferimos no saberlo a suponerlo mal.',
    fields: [
      {
        number: 16,
        name: 'rentabilidad_minima',
        label: 'Rentabilidad bruta mínima',
        type: 'radio',
        options: ['No trabajo con mínimo fijo', '4%', '5%', '6%', '7%', '8%', 'Más del 8%'],
      },
      {
        number: 17,
        name: 'margen_reventa',
        label: 'Margen mínimo si compra para revender',
        type: 'text',
        showIf: (a) => ['Comprar para reformar y vender', 'Comprar suelo para desarrollar', 'Varias'].includes(a.busca_ahora),
      },
      { number: 18, name: 'descuento_mercado', label: 'Descuento exigido sobre mercado', type: 'text' },
    ],
  },
  {
    id: 6,
    title: 'Cómo compra',
    fields: [
      {
        number: 19,
        name: 'tipo_operacion',
        label: 'Tipo de operación',
        type: 'checkbox',
        options: [
          'Alquilado y estable',
          'Reformar para revalorizar',
          'Reposicionar o cambiar de uso',
          'Promover desde cero',
          'Comprar para alquilar',
          'Sale & leaseback',
          'Activos con problemas a buen precio',
          'Carteras, NPL o REO',
        ],
      },
      {
        number: 20,
        name: 'que_asume',
        label: 'Qué asume',
        type: 'checkbox',
        options: [
          'Activo vacío',
          'Activo alquilado',
          'Reforma integral',
          'Obra parada',
          'Problemas urbanísticos',
          'Cargas o litigios',
          'Inquilino con renta baja',
          'Ocupación ilegal',
        ],
      },
      {
        number: 21,
        name: 'obra_asumida',
        label: 'Cuánta obra asume',
        type: 'radio',
        options: ['Ninguna', 'Ligera', 'Integral', 'Estructural', 'Sin límite si el número sale'],
      },
      {
        number: 22,
        name: 'exigencias_contrato',
        label: 'Qué exige del contrato y del inquilino',
        type: 'textarea',
        showIf: (a) => (a.que_asume || []).includes('Activo alquilado'),
      },
    ],
  },
  {
    id: 7,
    title: 'Lo innegociable y el proceso',
    fields: [
      {
        number: 23,
        name: 'descarta_operacion',
        label: 'Qué le hace descartar una operación de entrada',
        type: 'textarea',
        required: true,
        help: 'Si sabemos qué no quiere ver, no se lo mandamos.',
      },
      { number: 24, name: 'necesita_ver', label: 'Qué necesita ver para decidir si la estudia', type: 'textarea' },
      {
        number: 25,
        name: 'tiempo_firma',
        label: 'Cuánto tarda en firmar',
        type: 'radio',
        options: ['<30 días', '30–60', '60–90', '>90', 'Depende de la financiación'],
      },
      {
        number: 26,
        name: 'decision',
        label: 'Decide solo',
        type: 'radio',
        options: ['Sí', 'Visto bueno de socios', 'Comité de inversión'],
      },
      {
        number: 27,
        name: 'aviso_preferido',
        label: 'Cómo prefiere que le avisemos',
        type: 'radio',
        options: ['Llamada', 'WhatsApp', 'Email'],
      },
    ],
  },
]

export const FIELD_ORDER = STEPS.flatMap((s) => s.fields)

export function formatAnswersAsText(answers) {
  const lines = FIELD_ORDER.map((f) => {
    const value = answers[f.name]
    const text = Array.isArray(value) ? value.join(', ') : value
    return `${f.number}. ${f.label}: ${text && String(text).trim() ? text : 'NO CONSTA'}`
  })
  return lines.join('\n')
}
