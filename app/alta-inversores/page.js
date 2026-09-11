import Wizard from './Wizard'

export const metadata = {
  title: 'Alta de inversores | Demeter Corp',
  description: 'Cuéntenos qué busca y le avisaremos cuando tengamos una oportunidad que encaje.',
  robots: { index: false, follow: false },
}

export default function AltaInversores() {
  return <Wizard />
}
