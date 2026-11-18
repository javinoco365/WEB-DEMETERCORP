import Link from 'next/link'

export const metadata={title:'Página no encontrada',robots:{index:false,follow:false}}

export default function NotFound(){return <main id="contenido-404">
  <section className="page-hero not-found"><div className="shell">
    <span className="eyebrow">ERROR 404</span>
    <h1>Esta página no existe.</h1>
    <p>Puede que el enlace sea antiguo o que la dirección esté mal escrita. Puede volver al inicio o consultar las empresas del grupo.</p>
    <div className="actions"><Link className="btn primary" href="/">Ir al inicio</Link><Link className="btn" href="/empresas">Empresas del grupo</Link><Link className="btn" href="/contacto">Contacto</Link></div>
  </div></section>
</main>}
