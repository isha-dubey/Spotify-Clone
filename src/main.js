import './style.css'

document.addEventListener("DOMContentLoaded" , () => {

  if(localStorage.getItem("accessToken")){
 window.location.href = "Dashboard/Dashboard.html"
  }
  else {
    window.location.href = "Login/login.html"
  }
})