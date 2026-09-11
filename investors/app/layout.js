import './globals.css'

export const metadata = {
  title: 'Grupo Demeter — Alta de inversores',
  robots: { index: false, follow: false, nocache: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
