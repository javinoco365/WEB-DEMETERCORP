import './globals.css'
import Link from 'next/link'
import SiteHeader from '../components/SiteHeader'

export const metadata = {
  metadataBase: new URL('https://demetercorp.es'),
  title: 'Grupo Demeter | Capital, técnica y ejecución sobre activos reales.',
  description: 'Grupo empresarial con sede en Huelva especializado en agua, energía, infraestructura, patrimonio inmobiliario y desarrollo tecnológico.',
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
const organizationLd={"@context": "https://schema.org", "@type": "Organization", "@id": "https://demetercorp.es/#organization", "name": "Grupo Demeter", "legalName": "Demeter Corp, S.L.", "url": "https://demetercorp.es", "logo": "https://demetercorp.es/logos/demeter-corp.png", "email": "info@demetercorp.es", "address": {"@type": "PostalAddress", "streetAddress": "C/ Botticelli, 1", "postalCode": "21450", "addressLocality": "Cartaya", "addressRegion": "Huelva", "addressCountry": "ES"}, "areaServed": "ES", "sameAs": ["https://demetergod.com"], "knowsAbout": ["Reutilización de aguas", "Concesiones administrativas de agua", "Infraestructura hidráulica", "Energía y transición energética", "Licitación pública", "Patrimonio inmobiliario", "Alojamiento turístico", "Desarrollo de software"], "subOrganization": [{"@type": "Organization", "name": "Demeter God", "url": "https://demetergod.com", "logo": "https://demetercorp.es/logos/demeter-god.png", "description": "Adquisición, desarrollo, rehabilitación y explotación de activos inmobiliarios y alojamiento turístico."}, {"@type": "Organization", "name": "Demeter Water Consulting", "url": "https://demetercorp.es/empresas#demeter-water-consulting", "logo": "https://demetercorp.es/logos/demeter-water.png", "description": "Consultoría de gestión del agua: regeneración, reutilización, infraestructura hidráulica y concesiones administrativas."}, {"@type": "Organization", "name": "Demeter Soluciones Estratégicas", "url": "https://demetercorp.es/empresas#demeter-soluciones-estrategicas", "logo": "https://demetercorp.es/logos/demeter-soluciones.png", "description": "Energía, infraestructura, licitación pública y desarrollo tecnológico propio."}]}
const nav=[['Empresas','/empresas'],['Proyectos','/proyectos'],['Sectores','/sectores'],['Inversores','/inversores']]
export default function RootLayout({children}){return <html lang="es"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationLd)}}/><SiteHeader nav={nav}/>{children}<footer className="footer"><div className="shell footer-grid"><div><div className="footer-brand"><strong>DEMETER</strong> CORP</div><p>Grupo empresarial especializado en agua, energía, infraestructura, patrimonio y tecnología.</p><address className="footer-address">Demeter Corp, S.L.<br/>C/ Botticelli, 1 · 21450 Cartaya (Huelva)<br/><a href="mailto:info@demetercorp.es">info@demetercorp.es</a></address></div><div><span className="eyebrow">NAVEGACIÓN</span>{nav.map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</div><div><span className="eyebrow">LEGAL</span><Link href="/aviso-legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link></div></div><div className="shell legal">© {new Date().getFullYear()} Demeter Corp. Todos los derechos reservados. · demetercorp.es</div></footer></body></html>}
