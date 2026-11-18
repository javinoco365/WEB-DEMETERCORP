export default function sitemap(){
  const base='https://demetercorp.es'
  // Sin lastModified: una fecha de build idéntica en todas las URLs no aporta nada.
  const pages=[
    ['/',1,'weekly'],
    ['/empresas',.9,'monthly'],
    ['/proyectos',.8,'monthly'],
    ['/sectores',.8,'monthly'],
    ['/inversores',.9,'monthly'],
    ['/contacto',.7,'yearly'],
    ['/aviso-legal',.2,'yearly'],
    ['/privacidad',.2,'yearly'],
    ['/cookies',.2,'yearly'],
  ]
  return pages.map(([p,priority,changeFrequency])=>({url:base+p,changeFrequency,priority}))
}
