import './globals.css'
import Link from 'next/link'

export const metadata = {
  metadataBase: new URL('https://demetercorp.es'),
  title: 'Demeter Corp | Activos reales. Visión de largo plazo.',
  description: 'Grupo empresarial privado especializado en activos, recursos naturales, hospitality e inversión.',
  alternates:{canonical:'/'}
}
const nav=[['Grupo','/grupo'],['Empresas','/empresas'],['Sectores','/sectores'],['Proyectos','/proyectos'],['Inversores','/inversores'],['Contacto','/contacto']]
export default function RootLayout({children}){return <html lang="es"><body><header className="site-header"><div className="shell header-inner"><Link className="brand" href="/"><img src="/logos/demeter-corp.png" alt="Demeter Corp"/><span><strong>DEMETER</strong> CORP</span></Link><nav>{nav.map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</nav></div></header>{children}<footer className="footer"><div className="shell footer-grid"><div><div className="footer-brand"><strong>DEMETER</strong> CORP</div><p>Grupo empresarial privado especializado en activos, recursos naturales, hospitality e inversión.</p></div><div><span className="eyebrow">NAVEGACIÓN</span>{nav.map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</div><div><span className="eyebrow">LEGAL</span><Link href="/aviso-legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link></div></div><div className="shell legal">© {new Date().getFullYear()} Demeter Corp. Todos los derechos reservados. · demetercorp.es</div></footer></body></html>}
