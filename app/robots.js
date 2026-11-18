// /alta-inversores no se bloquea aquí: lleva noindex en la propia página, y un
// Disallow impediría a los buscadores leerlo. Los rastreadores de IA se
// permiten de forma expresa.
const AI_BOTS=['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-SearchBot','PerplexityBot','Google-Extended']

export default function robots(){
  return {
    rules:[
      {userAgent:'*',allow:'/',disallow:['/api/']},
      {userAgent:AI_BOTS,allow:'/',disallow:['/api/']},
    ],
    sitemap:'https://demetercorp.es/sitemap.xml',
  }
}
