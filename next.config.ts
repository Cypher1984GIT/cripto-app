// next.config.mjs (o next.config.js)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Mantén otras configuraciones que tengas
  images: {
    remotePatterns: [
      {
        protocol: 'https', // El protocolo usado por la URL de la imagen
        hostname: 'coin-images.coingecko.com', // El hostname del error
        port: '', // Puedes dejarlo vacío si usa el puerto estándar (443 para https)
        pathname: '/coins/images/**', // Opcional: Patrón para las rutas de las imágenes. '**' significa cualquier subruta.
      },
      // Puedes añadir más patrones aquí para otros dominios si los necesitas
    ],
  },
  // ...otras configuraciones que puedas tener
};

// Asegúrate de que el export sea correcto para tu tipo de archivo:
// Para next.config.mjs:
export default nextConfig;

// Si tu archivo es next.config.js, usarías:
// module.exports = nextConfig;