import ContactForm from '../../components/ContactForm'

export const metadata={title:'Contacto | Demeter Corp'}

export default function Contacto(){return <>
  <section className="page-hero"><div className="shell"><span className="eyebrow">CONTACTO</span><h1>Conversemos sobre la oportunidad.</h1><p>Inversión, activos, proyectos o colaboración empresarial. Envíenos la información esencial y nuestro equipo la revisará con discreción.</p></div></section>
  <section className="section white"><div className="shell contact-grid">
    <div className="contact-copy"><span className="eyebrow">DEMETER CORP</span><h2>Contacto corporativo</h2><p className="lead">El formulario se remite directamente al equipo de Demeter Corp. No publicamos teléfono de contacto.</p><div className="contact-principles"><div><b>Confidencialidad</b><span>Tratamos cada contacto con discreción.</span></div><div><b>Información útil</b><span>Puede presentar activos, proyectos u oportunidades.</span></div><div><b>Respuesta por email</b><span>Responderemos a la dirección que indique en el formulario.</span></div></div></div>
    <ContactForm/>
  </div></section>
</>}
