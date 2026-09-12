import DossierForm from '../../components/DossierForm'
import HeroArt from '../../components/HeroArt'

export const metadata={title:'Inversores — Acceso al dossier | Grupo Demeter',description:'Grupo Demeter estructura entradas de capital en activos reales: agua, energía, infraestructura y patrimonio. Acceso al dossier bajo NDA.'}

const razones=[
 ['Originación propia','No dependemos de intermediarios ni de procesos de venta competida para acceder a las oportunidades que estudiamos. La relación directa con propietarios de activos, administraciones y operadores del sector nos da acceso a operaciones antes de que lleguen —si es que llegan— al mercado abierto.'],
 ['Capacidad técnica interna','La due diligence de una operación de Grupo Demeter no se limita a lo financiero: incorpora el análisis técnico, normativo y de ejecución que hacen los propios equipos del grupo, especializados en cada sector.'],
 ['Control de la ejecución','No entregamos el activo a un tercero para que lo desarrolle o lo gestione. Las sociedades del grupo ejecutan directamente la obra, la tramitación administrativa o la explotación, lo que reduce el riesgo de ejecución que normalmente asume un inversor pasivo.'],
 ['Activos tangibles','Se invierte sobre un activo identificable —un inmueble, una concesión, una infraestructura, un contrato— no sobre una promesa de rentabilidad desvinculada de un subyacente concreto.'],
]
const formatos=[
 ['Coinversión en proyecto','Participación directa en una operación concreta, junto a Demeter, a través de la sociedad vehículo que corresponda.'],
 ['Entrada en sociedad vehículo','Adquisición de participación en la sociedad constituida específicamente para desarrollar un activo o una cartera de activos determinada.'],
 ['Deuda o participación híbrida','Financiación de una operación mediante instrumentos de deuda o estructuras que combinan deuda y participación en resultados, según el perfil de riesgo buscado.'],
 ['Acuerdos de desarrollo','Colaboración en el desarrollo de un activo o proyecto sin necesariamente implicar una estructura societaria conjunta, con reparto de responsabilidades y de resultado definido contractualmente.'],
]
const proceso=[
 ['01','Contacto','Solicita acceso al dossier a través del formulario. Revisamos cada solicitud individualmente antes de dar el siguiente paso.'],
 ['02','NDA','Formalizamos un acuerdo de confidencialidad que protege tanto la información del grupo como el interés que usted nos traslada.'],
 ['03','Dossier','Compartimos la documentación de la operación o de la cartera de oportunidades correspondiente a su perfil de interés.'],
 ['04','Reunión técnica','Una reunión con los equipos técnicos del grupo para resolver dudas concretas sobre el activo, la estructura y el calendario.'],
]
const faq=[
 ['¿Qué nivel de confidencialidad puedo esperar?','Toda la información específica de una operación —cifras, contrapartes, ubicación— se comparte exclusivamente bajo acuerdo de confidencialidad, y solo con quien ha acreditado un interés de inversión real. No compartimos esta información de forma pública ni con terceros ajenos a la operación.'],
 ['¿Cuál es el ticket mínimo de inversión?','Varía según el tipo de operación y de formato de colaboración. No fijamos un ticket mínimo único: lo determinamos en la conversación inicial, en función del proyecto o de la cartera que mejor encaje con su perfil.'],
 ['¿Qué horizonte de inversión manejan?','Grupo Demeter opera con horizonte de medio y largo plazo. No es una estructura pensada para rotación de capital a corto plazo, y buscamos coinversores alineados con esa misma visión.'],
 ['¿Cómo se estructura la gobernanza en una coinversión?','Depende del formato: en una sociedad vehículo, la gobernanza se define en el pacto de socios correspondiente, con los órganos y mayorías que se acuerden para cada operación. En todos los casos, Demeter mantiene la responsabilidad de la ejecución técnica del activo.'],
 ['¿Qué información de seguimiento recibiré tras invertir?','El reporting se acuerda como parte de la estructuración de cada operación, y se ajusta a la naturaleza del activo y al formato de colaboración elegido. Se detalla en la documentación compartida bajo NDA, no en esta página.'],
 ['¿En qué jurisdicción operan las sociedades del grupo?','Todas las sociedades de Grupo Demeter están constituidas conforme a derecho español, con domicilio social en Cartaya (Huelva), y desarrollan su actividad principalmente en España.'],
]

export default function Inversores(){return <>
 <section className="page-hero"><div className="shell page-hero-grid"><div><span className="eyebrow">INVERSORES</span><h1>Antes de hablar de rentabilidad, hablamos del activo.</h1></div><div className="page-hero-art"><HeroArt kind="growth" accent="#c7a25b"/></div></div></section>

 <section className="section white"><div className="shell content-grid"><div><span className="eyebrow">TESIS DE INVERSIÓN</span></div><div className="copy">
  <p>Grupo Demeter invierte —y busca coinversores para hacerlo— en activos reales dentro de sectores con fundamento estructural: agua y su reutilización, energía y transición energética, infraestructura pública y privada, y patrimonio inmobiliario con potencial de reposicionamiento. La tesis no es sectorial en abstracto: es sobre el tipo de activo. Buscamos operaciones donde exista una necesidad real y donde la complejidad técnica o administrativa de la operación limite la competencia de otros compradores o inversores.</p>
  <p>Esa complejidad es, precisamente, lo que Grupo Demeter sabe gestionar. No competimos por el activo más visible o más disputado: competimos por el activo que exige entender una concesión administrativa, un pliego de licitación, un proceso de rehabilitación técnica o un marco normativo cambiante.</p>
  <p>No se trata de una tesis de rotación rápida. Grupo Demeter opera con horizonte de medio y largo plazo, y espera lo mismo de quien coinvierte con nosotros: capital paciente, dispuesto a acompañar el desarrollo real del activo, no solo su valorización sobre el papel.</p>
 </div></div></section>

 <section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">POR QUÉ DEMETER</span></div><div><h2>Cuatro razones para coinvertir con nosotros.</h2></div></div><div className="values cols-4">{razones.map(r=><div className="value" key={r[0]}><h3>{r[0]}</h3><p>{r[1]}</p></div>)}</div></div></section>

 <section className="section white"><div className="shell"><div className="section-head"><div><span className="eyebrow">FORMATOS</span></div><div><h2>Cómo se estructura la entrada de capital.</h2></div></div><div className="values cols-4">{formatos.map(f=><div className="value" key={f[0]}><h3>{f[0]}</h3><p>{f[1]}</p></div>)}</div><p style={{color:'var(--muted)',marginTop:30,maxWidth:820}}>Estos formatos se describen aquí en términos generales. Ninguno de ellos constituye una oferta de valores, un producto financiero estandarizado ni una promesa de rentabilidad: cada operación se estructura de forma específica, y sus términos concretos se comparten únicamente con quien accede al dossier correspondiente.</p></div></section>

 <section className="section dark"><div className="shell content-grid"><div><span className="eyebrow">PERFIL BUSCADO</span></div><div className="copy">
  <p style={{color:'#cad6df'}}>Buscamos inversores institucionales, family offices y patrimonios privados con capacidad de análisis propio, horizonte de inversión de medio a largo plazo, y disposición a acompañar operaciones que requieren desarrollo activo del activo, no solo despliegue de capital pasivo.</p>
  <p style={{color:'#cad6df'}}>Esperamos de esa relación la misma disciplina que aplicamos nosotros: interés real y verificable antes de acceder a información confidencial, capacidad de decisión en plazos razonables una vez compartido el dossier, y una gobernanza clara sobre el papel de cada parte. No buscamos relaciones transaccionales de una sola operación: buscamos socios de capital con quienes construir un histórico de operaciones conjuntas.</p>
 </div></div></section>

 <section className="section white"><div className="shell"><div className="section-head"><div><span className="eyebrow">PROCESO</span></div><div><h2>De la solicitud a la reunión técnica.</h2></div></div><div className="steps-grid" style={{background:'var(--line)',border:'1px solid var(--line)'}}>{proceso.map(p=><div className="step" key={p[0]} style={{background:'white'}}><strong style={{color:'var(--navy)'}}>{p[0]} · {p[1]}</strong><p style={{color:'var(--muted)'}}>{p[2]}</p></div>)}</div></div></section>

 <section className="section"><div className="shell content-grid"><div><span className="eyebrow">PREGUNTAS FRECUENTES</span></div><div>{faq.map(f=><details className="faq-item" key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</div></div></section>

 <section className="section white" id="dossier"><div className="shell contact-grid">
  <div className="contact-copy"><span className="eyebrow">SOLICITAR ACCESO</span><h2>Solicitar acceso al dossier</h2><p className="lead">Revisamos cada solicitud de forma individual. Si acredita interés real, le haremos llegar un acuerdo de confidencialidad y, después, el dossier correspondiente a su perfil.</p></div>
  <DossierForm/>
 </div></section>
</>}
