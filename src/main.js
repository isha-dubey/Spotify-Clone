import './style.css'

document.addEventListener("DOMContentLoaded" , () => {

  if(localStorage.getItem("accesstoken")){
    window.location.href = "Dashboard/Dashboard.html"
  }
  else {
    window.location.href = "Login/login.html"
  }
})