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
      playlistItem.className = "bg-black-secondary  rounded p-4 border-solid border-2 hover:cursor-pointer hover:bg-light-black"
      playlistItem.id = id
      playlistItem.setAttribute("data-type" , "playlist")
      playlistItem.addEventListener("click" , onPlaylistItemClicked )
       
      const [{url : imageurl}] = images
      playlistItem.innerHTML = `
      <img src="${imageurl}" alt="${name}" class="rounded mb-2 object-contain shadow">
      <h2 class="text-base font-semibold mb-4 truncate line-clamp-2">${name}</h2>
      <h3 class="text-sm text-secondary ">${description}</h3>
      `
      playlistItemsSection.appendChild(playlistItem)
      
   }  
}


const loadPlaylists = () => {
   loadPlaylist(ENDPOINT.featuredPlaylist , "featured-playlist-items")
   loadPlaylist(ENDPOINT.toplists , "top-playlist-items")
   
}

const fillContentForDashboard = () => {
   const pageContent = document.querySelector("#page-content")
   const playlistMap =  new Map([["featured" , "featured-playlist-items"] , [ "toplists" , "top-playlist-items"]])
   let innerHTML = ''
   for (let [type , id] of playlistMap)
   {
      innerHTML += `
      <article class="p-4">
      <h1 class="text-2xl mb-4 font-bold capitalize">${type}</h1>
      <section id="${id}" class="featured-songs grid grid-cols-auto-fill-cards gap-4" id="featured-playist-items">
       
      </section>
      </article>`
   }
   pageContent.innerHTML = innerHTML
}

document.addEventListener("DOMContentLoaded" , () =>{
loadUserProfile()
fillContentForDashboard()
loadPlaylists()

  document.addEventListener("click" , () => {
    const profileMenu = document.querySelector("#profile-menu") 
     if (!profileMenu.classList.contains("hidden")){
      profileMenu.classList.remove("hidden")
     }
  })
})