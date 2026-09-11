// Fuente única de verdad para los campos del formulario corto de alta de
// inversores. La usan tanto el formulario (app/alta-inversores/Wizard.js)
// como la API route que formatea el email (app/api/alta-inversores/route.js),
// así el orden y las etiquetas nunca se desincronizan.
// Ver docs/spec-modulo-alta-inversores.md en la raíz del repo.

export const FIELDS = [
  { number: 1, name: 'nombre_completo', label: 'Nombre y apellidos', type: 'text', required: true },
  { number: 2, name: 'email', label: 'Email', type: 'email', required: true },
  { number: 3, name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
  {
    number: 4,
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
  {
    number: 5,
    name: 'tipologias',
    label: 'Tipologías',
    type: 'checkbox',
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
  {
    number: 6,
    name: 'zonas_compra',
    label: 'Zonas donde compra',
    type: 'textarea',
    required: true,
    help: 'Cuanto más concreto mejor, «Andalucía» y «Huelva capital» nos llevan a mandarle cosas distintas.',
  },
  {
    number: 7,
    name: 'importe_maximo',
    label: 'Importe máximo de inversión',
    type: 'range',
    required: true,
    min: 0,
    max: 25000000,
    step: 50000,
    default: 500000,
  },
  {
    number: 8,
    name: 'descarta_operacion',
    label: 'Qué le hace descartar una operación de entrada',
    type: 'textarea',
    help: 'Si sabemos qué no quiere ver, no se lo mandamos.',
  },
  {
    number: 9,
    name: 'aviso_preferido',
    label: 'Cómo prefiere que le avisemos',
    type: 'radio',
    options: ['Llamada', 'WhatsApp', 'Email'],
  },
]

function formatEuros(value) {
  return `${new Intl.NumberFormat('es-ES').format(Number(value))} €`
}

export function formatAnswersAsText(answers) {
  const lines = FIELDS.map((f) => {
    const value = answers[f.name]
    let text
    if (Array.isArray(value)) text = value.join(', ')
    else if (f.type === 'range' && value !== undefined && value !== null && value !== '') text = formatEuros(value)
    else text = value
    return `${f.number}. ${f.label}: ${text && String(text).trim() ? text : 'NO CONSTA'}`
  })
  return lines.join('\n')
}
