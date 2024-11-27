const nextConfig = {
  experimental: {
    middlewareResponseBody: true, // Habilita características experimentales relacionadas con el middleware
  },
  async redirects() {
    return [
      {
        source: "/", // Redirige desde la raíz
        destination: "/login", // Hacia la página de login
        permanent: false, // Temporal (puedes cambiarlo a true si es una redirección permanente)
      },
    ];
  },
};

module.exports = nextConfig;