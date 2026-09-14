'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SiteHeader({nav}){
  const [open,setOpen]=useState(false)
  return <>
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" onClick={()=>setOpen(false)}><Image src="/logos/demeter-corp.png" alt="Demeter Corp" width={42} height={42} priority/><span><strong>DEMETER</strong> CORP</span></Link>
        <nav className="desktop-nav">{nav.map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</nav>
        <div className="header-ctas">
          <Link className="btn outline-dark small" href="/contacto">Plantear un proyecto</Link>
          <Link className="btn primary small" href="/inversores#dossier">Solicitar acceso al dossier</Link>
        </div>
        <button className="menu-toggle" aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} onClick={()=>setOpen(!open)}>
          <span className={open?'open':''}/><span className={open?'open':''}/><span className={open?'open':''}/>
        </button>
      </div>
    </header>
    {open && <div className="mobile-panel">
      <nav>{nav.map(([l,h])=><Link key={h} href={h} onClick={()=>setOpen(false)}>{l}</Link>)}</nav>
      <div className="mobile-panel-ctas">
        <Link className="btn outline-dark" href="/contacto" onClick={()=>setOpen(false)}>Plantear un proyecto</Link>
        <Link className="btn primary" href="/inversores#dossier" onClick={()=>setOpen(false)}>Solicitar acceso al dossier</Link>
      </div>
    </div>}
  </>
}
