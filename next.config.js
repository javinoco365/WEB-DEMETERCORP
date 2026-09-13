/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/grupo', destination: '/', permanent: true },
      { source: '/empresas/demeter-soluciones-estrategicas', destination: '/empresas#demeter-soluciones-estrategicas', permanent: true },
      { source: '/empresas/demeter-water-consulting', destination: '/empresas#demeter-water-consulting', permanent: true },
    ]
  },
}

module.exports = nextConfig
