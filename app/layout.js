import './globals.css'
import Link from 'next/link'
import SiteHeader from '../components/SiteHeader'
import RevealObserver from '../components/RevealObserver'

const SITE='https://demetercorp.es'
const DESCRIPTION='Grupo empresarial con sede en Huelva especializado en agua, energía, infraestructura, patrimonio inmobiliario y desarrollo tecnológico.'
const TITLE='Grupo Demeter | Capital, técnica y ejecución sobre activos reales'

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s | Grupo Demeter' },
  description: DESCRIPTION,
  applicationName:'Grupo Demeter',
  // Cada página define su propio Open Graph (lib/meta.js); esto es solo la base.
  openGraph:{ type:'website', locale:'es_ES', siteName:'Grupo Demeter', images:['/opengraph-image.png'] },
  twitter:{ card:'summary_large_image' },
  robots:{ index:true, follow:true },
}

const ORG_ID=`${SITE}/#organization`
const structuredData={
  '@context':'https://schema.org',
  '@graph':[
    {
      '@type':'Organization',
      '@id':ORG_ID,
      name:'Grupo Demeter',
      legalName:'Demeter Corp, S.L.',
      taxID:'B21885033',
      url:SITE,
      logo:`${SITE}/logos/demeter-corp-640.png`,
      email:'info@demetercorp.es',
      description:DESCRIPTION,
      address:{'@type':'PostalAddress',streetAddress:'C/ Botticelli, 1',postalCode:'21450',addressLocality:'Cartaya',addressRegion:'Huelva',addressCountry:'ES'},
      areaServed:'ES',
      knowsAbout:['Reutilización de aguas','Concesiones administrativas de agua','Infraestructura hidráulica','Energía y transición energética','Licitación pública','Patrimonio inmobiliario','Alojamiento turístico','Desarrollo de software'],
      // Cada filial es una entidad propia, enlazada por @id. Sin sameAs hacia
      // demetergod.com: es otra sociedad, no otra URL de esta.
      subOrganization:[
        {'@type':'Organization','@id':'https://demetergod.com/#organization',name:'Demeter God',legalName:'Demeter God, S.L.U.',url:'https://demetergod.com',logo:`${SITE}/logos/demeter-god.png`,description:'Adquisición, desarrollo, rehabilitación y explotación de activos inmobiliarios y alojamiento turístico.',parentOrganization:{'@id':ORG_ID}},
        {'@type':'Organization','@id':`${SITE}/empresas#demeter-water-consulting`,name:'Demeter Water Consulting',legalName:'Demeter Water Consulting, S.L.U.',url:`${SITE}/empresas#demeter-water-consulting`,logo:`${SITE}/logos/demeter-water.png`,description:'Consultoría de gestión del agua: regeneración, reutilización, infraestructura hidráulica y concesiones administrativas.',parentOrganization:{'@id':ORG_ID}},
        {'@type':'Organization','@id':`${SITE}/empresas#demeter-soluciones-estrategicas`,name:'Demeter Soluciones Estratégicas',legalName:'Demeter Soluciones Estratégicas, S.L.U.',url:`${SITE}/empresas#demeter-soluciones-estrategicas`,logo:`${SITE}/logos/demeter-soluciones.png`,description:'Energía, infraestructura, licitación pública y desarrollo tecnológico propio.',parentOrganization:{'@id':ORG_ID}},
      ],
    },
    {'@type':'WebSite','@id':`${SITE}/#website`,url:SITE,name:'Grupo Demeter',inLanguage:'es-ES',publisher:{'@id':ORG_ID}},
  ],
}

// Marca <html> con «js» antes del primer pintado para que las apariciones no
// parpadeen. Red de seguridad: si el observador no llega a arrancar en 3 s,
// se retira la clase y todo queda visible.
const revealBoot="document.documentElement.classList.add('js');setTimeout(function(){if(!window.__rv)document.documentElement.classList.remove('js')},3000)"

const nav=[['Empresas','/empresas'],['Proyectos','/proyectos'],['Sectores','/sectores'],['Inversores','/inversores']]

export default function RootLayout({children}){
  return <html lang="es">
    <head><script dangerouslySetInnerHTML={{__html:revealBoot}}/></head>
    <body>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/>
      <SiteHeader nav={nav}/>
      <div id="contenido">{children}</div>
      <footer className="footer">
        <div className="shell footer-grid">
          <div>
            <div className="footer-brand"><strong>DEMETER</strong> CORP</div>
            <p>Grupo empresarial especializado en agua, energía, infraestructura, patrimonio y tecnología.</p>
            <address className="footer-address">Demeter Corp, S.L. · NIF B21885033<br/>C/ Botticelli, 1 · 21450 Cartaya (Huelva)<br/>Registro Mercantil de Huelva, Hoja H-29749<br/><a href="mailto:info@demetercorp.es">info@demetercorp.es</a></address>
          </div>
          <div><span className="eyebrow">NAVEGACIÓN</span>{nav.map(([l,h])=><Link key={h} href={h}>{l}</Link>)}<Link href="/contacto">Contacto</Link></div>
          <div><span className="eyebrow">LEGAL</span><Link href="/aviso-legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link></div>
        </div>
        <div className="shell legal">© {new Date().getFullYear()} Demeter Corp, S.L. · Todos los derechos reservados · demetercorp.es</div>
      </footer>
      <RevealObserver/>
    </body>
  </html>
}
