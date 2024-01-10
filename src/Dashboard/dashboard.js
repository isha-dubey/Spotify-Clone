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
  
 if(images?.length)
 {
    defaultImage.classList.add("hidden")
 } else {
    defaultImage.classList.remove("hidden")
 }

 profileButton.addEventListener("click" , onProfileClick )

  displayNameElement.textContent = displayName

}


const onPlaylistItemClicked = (event) => {
   console.log(event.target)
} 

const loadPlaylist = async(endpoint , elementId) =>
{
   const {playlists : {items}} = await FetchRequest(endpoint)
   const playlistItemsSection = document.querySelector(`#${elementId}`)
   
 
   for ( let {name , description , images , id } of items) {
      const playlistItem = document.createElement("section")
      playlistItem.className = "rounded p-4 border-solid border-2 hover:cursor-pointer"
      playlistItem.id = id
      playlistItem.setAttribute("data-type" , "playlist")
      playlistItem.addEventListener("click" , onPlaylistItemClicked )
       
      const [{url : imageurl}] = images
      playlistItem.innerHTML = `
      <img src="${imageurl}" alt="${name}" class="rounded mb-2 object-contain shadow">
      <h2 class="text-sm">${name}</h2>
      <h3 class="text-xs ">${description}</h3>
      `
      playlistItemsSection.appendChild(playlistItem)
      
   }  
}


const loadPlaylists = () => {
   loadPlaylist(ENDPOINT.featuredPlaylist , "featured-playlist-items")
   loadPlaylist(ENDPOINT.toplists , "top-playlist-items")
   
}

document.addEventListener("DOMContentLoaded" , () =>{
loadUserProfile()
loadPlaylists()

  document.addEventListener("click" , () => {
    const profileMenu = document.querySelector("#profile-menu") 
     if (!profileMenu.classList.contains("hidden")){
      profileMenu.classList.remove("hidden")
     }
  })
})