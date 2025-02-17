// vite.config.js
export default {
  server: {
    proxy: {
      '/tasks': 'http://localhost:5000',
    },
  },
};
