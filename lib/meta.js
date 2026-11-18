// Metadatos por página: canonical, Open Graph y Twitter propios de cada ruta.
// El título se pasa sin marca; el layout añade «| Grupo Demeter» con title.template.
const SITE='Grupo Demeter'

export function pageMeta(path,title,description,extra={}){
  const full=`${title} | ${SITE}`
  return {
    title,
    description,
    alternates:{canonical:path},
    openGraph:{type:'website',locale:'es_ES',siteName:SITE,url:path,title:full,description,images:['/opengraph-image.png']},
    twitter:{card:'summary_large_image',title:full,description,images:['/opengraph-image.png']},
    ...extra,
  }
}
