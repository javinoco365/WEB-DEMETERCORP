export default function sitemap(){
  const base='https://demetercorp.es'
  const now=new Date()
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
  return pages.map(([p,priority,changeFrequency])=>({url:base+p,lastModified:now,changeFrequency,priority}))
}
