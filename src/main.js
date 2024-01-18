import { APP_URL } from './common'
import './style.css'

document.addEventListener("DOMContentLoaded" , () => {

  if(localStorage.getItem("accessToken")){
 window.location.href = `${APP_URL}/Dashboard/Dashboard.html`
  }
  else {
    window.location.href =  `${APP_URL}/Login/login.html`
  }
})