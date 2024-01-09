import { ENDPOINT, logout } from "../common"
import { FetchRequest } from "../api"

const onProfileClick = (event) => {
   event.stopPropagation()
    const profileMenu = document.querySelector("#profile-menu")
    profileMenu.classList.toggle("hidden")
    if (!profileMenu.classList.contains("hidden"))
    {
      profileMenu.querySelector("li#logout").addEventListener("click" , logout)
    }
}


const loadUserProfile = async() => {
 const defaultImage = document.querySelector("#default-image")
 const profileButton = document.querySelector("#user-profile-button")
 const displayNameElement = document.querySelector("#display-name")
 const {display_name : displayName , images} = await FetchRequest(ENDPOINT.userinfo)
  
 if(images?.length){
    defaultImage.classList.add("hidden")
 } else {
    defaultImage.classList.remove("hidden")
 }

 profileButton.addEventListener("click" , onProfileClick )

  displayNameElement.textContent = displayName

}


const loadFeaturePlaylist = async() =>
{
   const featuredPlaylist = await FetchRequest(ENDPOINT.featuredPlaylist)
   console.log(featuredPlaylist)
}

document.addEventListener("DOMContentLoaded" , () =>{
loadUserProfile()
loadFeaturePlaylist()

  document.addEventListener("click" , () => {
    const profileMenu = document.querySelector("#profile-menu") 
     if (!profileMenu.classList.contains("hidden")){
      profileMenu.classList.remove("hidden")
     }
  })
})