export default function robots(){
  return {
    rules:[{userAgent:'*',allow:'/',disallow:['/api/','/alta-inversores']}],
    sitemap:'https://demetercorp.es/sitemap.xml',
    host:'https://demetercorp.es',
  }
}
