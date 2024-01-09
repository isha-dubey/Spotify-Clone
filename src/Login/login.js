import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common"


const CLIENT_ID = "e9287ef57526422695b5bf665dbdf3af"
const  REDIRECT_URI =  "http://localhost:5173/Login/login.html"
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read"
const APP_URL =  "http://localhost:5173"


const  authorizeUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`
    console.log('Authorization URL:', url);
    window.open( url , "login" , "width=500px ,height=500px" )
}


document.addEventListener('DOMContentLoaded' , ()=> {
    const loginButton = document.getElementById("login_to_spotify")
    loginButton.addEventListener("click" , authorizeUser)

})


window.setItemsInLocalStorage = ({ accessToken , tokenType , expiresIn}) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_TYPE , tokenType);
    localStorage.setItem(EXPIRES_IN ,  (Date.now() + expiresIn * 1000));
}



window.addEventListener("load" , () => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN);

    if (storedAccessToken) {
        window.close()
        window.location.href = `${APP_URL}/Dashboard/Dashboard.html`;
    }

    if (window.opener !== null && !window.opener.closed) {
        window.focus();

         if (window.location.href.includes('error')) {
            window.close();
            }

        const { hash } = window.location;

        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token");
        const tokenType = searchParams.get("token_type");
        const expiresIn = searchParams.get("expires_in");


        if (accessToken) {
          
            window.opener.setItemsInLocalStorage({
                accessToken,
                tokenType,
                expiresIn
            });
            window.location.href =`${APP_URL}/Dashboard/Dashboard.html` ;
        } else {
            window.close();
        }
    } else {
    }
});




















