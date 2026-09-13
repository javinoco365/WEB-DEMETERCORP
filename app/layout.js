import './globals.css'
import Link from 'next/link'
import SiteHeader from '../components/SiteHeader'

export const metadata = {
  metadataBase: new URL('https://demetercorp.es'),
  title: 'Grupo Demeter | Capital, técnica y ejecución sobre activos reales.',
  description: 'Grupo empresarial con sede en Huelva especializado en agua, energía, infraestructura, patrimonio inmobiliario y desarrollo tecnológico.',
  alternates:{canonical:'/'},
  applicationName:'Grupo Demeter',
  keywords:['Grupo Demeter','Demeter Corp','Demeter God','Demeter Water Consulting','Demeter Soluciones Estratégicas','inversión activos reales','agua','energía','infraestructura','patrimonio','Huelva'],
  openGraph:{
    type:'website',
    locale:'es_ES',
    url:'https://demetercorp.es',
    siteName:'Grupo Demeter',
    title:'Grupo Demeter | Capital, técnica y ejecución sobre activos reales.',
    description:'Grupo empresarial con sede en Huelva especializado en agua, energía, infraestructura, patrimonio inmobiliario y desarrollo tecnológico.',
  },
  twitter:{card:'summary_large_image'},
  robots:{index:true,follow:true},
}
const nav=[['Empresas','/empresas'],['Proyectos','/proyectos'],['Sectores','/sectores'],['Inversores','/inversores']]
export default function RootLayout({children}){return <html lang="es"><body><SiteHeader nav={nav}/>{children}<footer className="footer"><div className="shell footer-grid"><div><div className="footer-brand"><strong>DEMETER</strong> CORP</div><p>Grupo empresarial especializado en agua, energía, infraestructura, patrimonio y tecnología.</p></div><div><span className="eyebrow">NAVEGACIÓN</span>{nav.map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</div><div><span className="eyebrow">LEGAL</span><Link href="/aviso-legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link></div></div><div className="shell legal">© {new Date().getFullYear()} Demeter Corp. Todos los derechos reservados. · demetercorp.es</div></footer></body></html>}
