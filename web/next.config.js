const withPWA = require("next-pwa")({
  dest: "public", // Define onde armazenar os arquivos gerados
  register: true, // Registra o Service Worker automaticamente
  skipWaiting: true, // Força o SW a ativar imediatamente
});

module.exports = withPWA({
  // Outras configurações do Next.js
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    }
  }
});
