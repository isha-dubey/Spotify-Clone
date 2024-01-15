/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
        "green" : "#1DB954" ,
        "black" : "#000000" ,
        "black-base" : "#121212" ,
        "black-primary" : "#191414" ,
        "black-secondary" : "#171818" ,
        "light-black" : "#282828" ,
        "white" : "#FFFFFF" ,
        "secondary" : "#b3b3b3" ,
        "gray" : "#535353" ,
        "transparent" : "transparent"

    },
    gridTemplateColumns : {
        'auto-fill-cards' : 'repeat(auto-fill, minmax(200px , 1fr))'
    },
   
    extend: {},
  },
  plugins: [],
}


