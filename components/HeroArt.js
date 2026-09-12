export default function HeroArt({kind='diamond',accent='#c7a25b'}){
  const common={width:'100%',height:'auto',maxWidth:280,display:'block',margin:'0 auto'}
  if(kind==='layers') return <svg viewBox="0 0 280 280" style={common} aria-hidden="true">
    <rect x="25" y="40" width="195" height="42" rx="4" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
    <rect x="55" y="98" width="215" height="42" rx="4" fill="rgba(255,255,255,.1)" stroke={accent} strokeWidth="2"/>
    <rect x="25" y="156" width="165" height="42" rx="4" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
    <rect x="60" y="214" width="200" height="42" rx="4" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
    <circle cx="255" cy="60" r="5" fill={accent}/>
  </svg>
  if(kind==='wave') return <svg viewBox="0 0 280 280" style={common} aria-hidden="true">
    <circle cx="140" cy="140" r="105" fill="none" stroke="rgba(255,255,255,.12)"/>
    <circle cx="140" cy="140" r="72" fill="none" stroke={accent} strokeWidth="1.5"/>
    <path d="M45 165 C80 140 100 190 140 165 S200 140 235 165" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
    <path d="M45 190 C80 165 100 215 140 190 S200 165 235 190" fill="none" stroke={accent} strokeWidth="2"/>
    <circle cx="140" cy="140" r="5" fill={accent}/>
  </svg>
  if(kind==='growth') return <svg viewBox="0 0 280 280" style={common} aria-hidden="true">
    <line x1="35" y1="230" x2="255" y2="230" stroke="rgba(255,255,255,.25)"/>
    <rect x="55" y="180" width="30" height="50" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.25)"/>
    <rect x="105" y="145" width="30" height="85" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.25)"/>
    <rect x="155" y="100" width="30" height="130" fill="rgba(255,255,255,.1)" stroke={accent} strokeWidth="1.5"/>
    <rect x="205" y="60" width="30" height="170" fill="rgba(255,255,255,.12)" stroke={accent} strokeWidth="2"/>
    <circle cx="220" cy="50" r="4" fill={accent}/>
  </svg>
  return <svg viewBox="0 0 280 280" style={common} aria-hidden="true">
    <rect x="60" y="60" width="140" height="140" fill="none" stroke="rgba(255,255,255,.15)" transform="rotate(10 130 130)"/>
    <rect x="80" y="45" width="160" height="160" fill="rgba(255,255,255,.04)" stroke={accent} strokeWidth="2" transform="rotate(-12 160 125)"/>
    <rect x="95" y="95" width="90" height="90" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.3)" transform="rotate(6 140 140)"/>
    <circle cx="235" cy="70" r="4" fill={accent}/>
    <circle cx="55" cy="215" r="3" fill="rgba(255,255,255,.4)"/>
  </svg>
}
