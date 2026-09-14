import ContactForm from '../../components/ContactForm'

export const metadata={alternates:{canonical:'/contacto'},title:'Plantear un proyecto | Grupo Demeter',description:'Plantee a Grupo Demeter un proyecto de agua, energía, infraestructura, patrimonio o tecnología. Lo revisa el equipo técnico de la sociedad correspondiente.'}

export default function Contacto(){return <>
  <section className="page-hero"><div className="shell"><span className="eyebrow">PLANTEAR UN PROYECTO</span><h1>Cuéntenos la necesidad técnica.</h1><p>Si representa una administración, una empresa o un propietario de activos con un proyecto concreto en agua, energía, infraestructura, patrimonio o tecnología, este es el camino directo. Para solicitar acceso al dossier de inversores, use el formulario de la <a className="text-link" href="/inversores#dossier" style={{color:'inherit',borderColor:'currentColor'}}>página de Inversores</a>.</p></div></section>
  <section className="section white"><div className="shell contact-grid">
    <div className="contact-copy"><span className="eyebrow">GRUPO DEMETER</span><h2>Plantear un proyecto</h2><p className="lead">El equipo de la sociedad correspondiente revisará su propuesta y le contactará en los próximos días.</p><div className="contact-principles"><div><b>Confidencialidad</b><span>Tratamos cada propuesta con discreción.</span></div><div><b>Información útil</b><span>Cuanto más concreta sea la necesidad, antes podremos valorarla.</span></div><div><b>Respuesta por email</b><span>Responderemos a la dirección que indique en el formulario.</span></div></div></div>
    <ContactForm/>
  </div></section>
</>}
