module.exports = {
  content: [
    '../../apps/**/*.{js,ts,vue}',
    '../../libs/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@iconify/tailwind4'),
  ],
}