import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const  REDIRECT_URI =  'http://localhost:5173/Login/login.html'
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read"

const APP_URL = 'http://localhost:5173'


const  authorizeUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`
    window.open(url , "login" , "width=500px ,height=500px" )
}


document.addEventListener('DOMContentLoaded' , ()=> {
    const loginButton = document.getElementById("login_to_spotify")
    loginButton.addEventListener('click' , authorizeUser)

})


window.setItemsInLocalStorage = ({ accessToken , tokenType , expiresIn}) =>
{
    localStorage.setItem(ACCESS_TOKEN, accessToken)
    localStorage.setItem(TOKEN_TYPE , tokenType)
    localStorage.setItem(EXPIRES_IN , expiresIn)
}


window.addEventListener("load" , () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    if(accessToken){
       window.location.href= `${APP_URL}/Dashboard/Dashboard.html`
    }
    // if (!window.opener && !window.opener.closed) {
    
    if (window.opener !== null && !window.opener.closed) {
        
        window.focus()
        if(window.location.href.includes('error')){
            window.close()
        }
        
        const { hash } = window.location
        const searchParams = new URLSearchParams(hash)
        const accessToken = searchParams.get("#access_token")
        const tokenType = searchParams.get("token_type")
        const expiresIn = searchParams.get("expires_in")
        if(accessToken) {
              window.close()
              window.opener.setItemsInLocalStorage({accessToken , tokenType , expiresIn})
         window.location.href = APP_URL
        } else {
            window.close()
        }
    } 
})