// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oswald', 'sans-serif'],
      },
    },
  },
  // bật lại preflight (nếu đã tắt)
  corePlugins: {
    preflight: true,
  },
}
