// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-bai-jamjuree)"], // 👈 Bai Jamjuree for headings
        body: ["var(--font-roboto-flex)"],     // 👈 Roboto Flex for body text
      },
    },
  },
  plugins: [],
};
