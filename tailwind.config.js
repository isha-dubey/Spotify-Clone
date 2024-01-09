/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
        "green" : "#1DB954" ,
        "Dark" : "#191414" ,
        "white" : "#FFFFFF" ,
        "light-black" : "#282828" ,
        "secondary" : "#b3b3b3" ,
        "gray" : "#535353"

    },
    gridTemplateColumns : {
        'auto-fill-cards' : 'repeat(auto-fill, minmax(200px , 1fr))'
    },
    extend: {},
  },
  plugins: [],
}


