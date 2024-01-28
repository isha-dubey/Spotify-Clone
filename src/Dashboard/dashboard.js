import { ENDPOINT, getItemFromLocalStorage, LOADED_TRACKS, logout, SECTIONTYPE, setItemsInLocalStorage } from "../common"
import { FetchRequest } from "../api"

const audio = new Audio()
const audioControl = document.querySelector("#audio-control");
let displayName;

const onProfileClick = (event) => 
{
   event.stopPropagation()
    const profileMenu = document.querySelector("#profile-menu")
    profileMenu.classList.toggle("hidden")
    if (!profileMenu.classList.contains("hidden"))
    {
      profileMenu.querySelector("li#logout").addEventListener("click" , logout)
    }
}


const loadUserProfile = () =>
{
   return new Promise(async (resolve , reject) => {
    
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
   resolve({displayName})
     })

}



const onPlaylistItemClicked = (event , id) => 
{
   console.log(event.target)
   const section = { type: SECTIONTYPE.PLAYLIST , playlist : id }
   history.pushState(section, "" , `playlist/${id}`)
   loadSections(section)
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
      playlistItem.addEventListener("click" , (event) => {onPlaylistItemClicked(event , id)} )
   
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

const fillContentForDashboard = () => 
{
   const coverContent = document.querySelector("#cover-content")
   coverContent.innerHTML = `<h1 class="text-6xl">Hello, ${displayName} </h1>`
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

const formatTime = (duration) => 
{
   const min = Math.floor(duration/60_000)
   const sec = ((duration % 6_000) / 1000).toFixed(0)
   const formattedTime = sec == 60?
   min +1 + ":00":min + ":" + (sec < 10?"0":"") + sec
   return formattedTime
}

const onTrackSelection = (id , event ) => 
{
   document.querySelectorAll("#tracks").forEach(trackItem => {
      if (trackItem.id === id)
      {
         trackItem.classList.add("bg-gray" , "selected")
      }  else {
         trackItem.classList.remove("bg-gray" , "selected")
      }
   })

}

const updateIconsForPlayMode = (id) => {
   const playButton = audioControl.querySelector("#play")
   if(playButton){
      playButton.querySelector("span").textContent = "pause_circle"
      // playButtonInTracks.innerHTML = "pause"
   }
   const playButtonInTracks = document.querySelector(`#play-track-${id}`)
   if (playButtonInTracks) {
      playButtonInTracks.textContent = "pause";
  }
}

const updateIconsForPauseMode = (id) => {
   const playButton = audioControl.querySelector("#play");
   if (playButton) {
       playButton.querySelector("span").textContent = "play_circle";
   }

   const playButtonInTracks = document.querySelector(`#play-track-${id}`);
   if (playButtonInTracks) {
       playButtonInTracks.textContent = "play_arrow";
   }
}


const onAudioMetaDataLoaded = (id) => {
   const totalSongDuration = document.querySelector("#total-song-duration")
   totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`
}



const onNowPlayingPlayButtonClicked = (id) => {
   if(audio.paused) {
       audio.play()
       updateIconsForPlayMode(id)
   } else {
       audio.pause()
       updateIconsForPauseMode(id)
   }
}

const togglePlay = () => {
   if(audio.src) {
      if(audio.paused){
         audio.play()
      } else{
         audio.pause()
      }
   }
}


// const togglePlay = () => {
//    if (audio.src) {
//        if (audio.paused) {
//            audio.play().then(() => {
//                const selectedTrackId = audioControl.getAttribute("data-track-id");
//                updateIconsForPlayMode(selectedTrackId);
//            });
//        } else {
//            audio.pause();
//            const selectedTrackId = audioControl.getAttribute("data-track-id");
//            updateIconsForPauseMode(selectedTrackId);
//        }
//    }
// };


const findCurrentTrack = () => {
   const audioControl = document.querySelector("#audio-control")
   const  trackId = audioControl.getAttribute("data-track-id")
   if(trackId){
      const loadedTracks = getItemFromLocalStorage(LOADED_TRACKS)
      const currentTrackIndex = loadedTracks?.findIndex(trk => trk.id === trackId)
      return {currentTrackIndex , tracks:loadedTracks}
   }
   return null
}

const playNextTrack = () =>{
  const {currentTrackIndex = -1 , tracks = null} = findCurrentTrack() ?? {}
  if(currentTrackIndex > -1 && currentTrackIndex < tracks?.length - 1){
      playTrack(null , tracks[currentTrackIndex] + 1)
  }
}

const playPrevTrack = () =>{
   const {currentTrackIndex = -1 , tracks = null} = findCurrentTrack() ?? {}
   if(currentTrackIndex > 0 ){
       playTrack(null , tracks[currentTrackIndex] - 1)
   }
}

const playTrack = (e , { image, artistNames , name , previewURL , duration , id } ) => {
   if(e?.stopPropagation){
      e.stopPropagation()
   }
  const buttonWithDataPlay = document.querySelector(`[data-play="true"]`)
   if(audio.src === previewURL) {
      togglePlay()
   } else {
      document.querySelectorAll("[data-play]").forEach(button => 
         {
             button.setAttribute("data-play","false") 
            console.log(button) })

   const nowPlayingSongImage = document.querySelector("#now-playing-image")
   const songTitle = document.querySelector("#now-playing-song")
   const artists = document.querySelector("#now-playing-artists")
   const audioControl = document.querySelector("#audio-control")
   const songInfo = document.querySelector("#song-info")
   audioControl.setAttribute("data-track-id" , id)
   nowPlayingSongImage.src = image.url
   songTitle.textContent = name
   artists.textContent = artistNames
   audio.src = previewURL 
   audio.play()
   songInfo.classList.remove("invisible")
}}


const loadPlaylistTracks = ({ tracks }) => {
   const trackSections = document.querySelector("#tracks")
   let trackNo = 1
   const loadedTracks = [] 
   for ( let trackitem  of tracks.items.filter(items => items.track.preview_url) ){
         let {id , artists , name , album , duration_ms: duration , preview_url : previewURL} = trackitem.track
         let track = document.createElement("section")
         track.id = id
         track.className = "track p-1 grid grid-cols-[50px_1fr_1fr_50px] gap-4 items-center justify-items-start text-secondary rounder-md hover:bg-light-black"
         let image = album.images.find(img => img.height === 64)
         let artistNames = Array.from(artists , artist => artist.name).join(", ")
         track.innerHTML = ` 
            <p class="relative w-full flex items-center justify-self-center"><span class="tracknum" >${trackNo++}</span></p>
            <section class="grid grid-cols-[auto_1fr] place-items-center gap-2 ">
            <img class="h-10 w-10" src="${image.url}" alt="${name}">
            <article class="flex flex-col gap-2 justify-center ">
            <h2 class="text-white text-base line-clamp-1 song-title">${name}</h2>
            <p class="text-xs line-clamp-1">${artistNames}</p>
            </article>
            </section>
            <p class="text-sm" >${album.name}</p>
            <p class="text-sm">${formatTime(duration)}</p>
            `
         track.addEventListener("click" , (event)  => onTrackSelection(id , event) )
         const playButton = document.createElement("button")
         playButton.id = `play-track-${id}`
         playButton.className = `play w-full absolute left-0 text-lg invisible material-symbols-outlined `
         playButton.textContent = "play_arrow"
         playButton.addEventListener("click" , (e) =>
         
            playTrack( e , { image, artistNames , name , previewURL , duration , id })
         ) 
         track.querySelector("p").appendChild(playButton)
         trackSections.appendChild(track)
         loadedTracks.push({id , artistNames , name , album , duration , previewURL , image})
   }

   setItemsInLocalStorage(LOADED_TRACKS , loadedTracks)
}



const fillContentForPlaylist = async (playlistid) => {
   const playlist = await FetchRequest(`${ENDPOINT.playlist}/${playlistid}`)
   console.log(playlist)
   
   const {name , description, tracks , images} = playlist
   const coverElement = document.querySelector("#cover-content")
   coverElement.innerHTML = `    
        <section class="flex gap-16">
         <img class= " object-contain h-36 w-36" src="${images[0].url}" alt="">
        <section>
         <h2 id="playlist-name" class="text-4xl font-bold">${name}</h2>
        <p id="playlist-detials">${tracks.items.length} songs </p>
        </section>
        </section>`

   const pageContent = document.querySelector("#page-content")
   pageContent.innerHTML = ` 
         <header id="playlist-header" class="mx-8  border-secondary border-b-[0.5px] z-10 ">
            <nav class="py-2 ">
               <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary ">
                 <li class="justify-self-center" >#</li>
               <li>Title</li>
               <li>Album</li>
               <li>⏱</li>
               </ul>
            </nav>
         </header> 
         <section class="px-8 text-secondary mt-4  " id="tracks">
         </section>
        `

   console.log(playlist)
   loadPlaylistTracks(playlist)
}


const onContentScroll = (event) => {

   const { scrollTop } = event.target;
   const header = document.querySelector(".header");
   const coverElement = document.querySelector("#cover-content");
   const totalHeight = coverElement.offsetHeight;
   const fiftyPercentHeight = totalHeight / 2;
   const coverOpacity = 100 - (scrollTop >= totalHeight ? 100 : (scrollTop / totalHeight) * 100);
   coverElement.style.opacity = `${coverOpacity}%`;

   let headerOpacity = 0;
   // once 50% of cover element is crossed, start increasing the opacity
   if (scrollTop >= fiftyPercentHeight && scrollTop <= totalHeight) {
       let totatDistance = totalHeight - fiftyPercentHeight;
       let coveredDistance = scrollTop - fiftyPercentHeight;
       headerOpacity = (coveredDistance / totatDistance) * 100;
   } else if (scrollTop > totalHeight) {
       headerOpacity = 100;
   } else if (scrollTop < fiftyPercentHeight) {
       headerOpacity = 0;
   }
   header.style.background = `rgba(0 0 0 / ${headerOpacity}%)`

   if (history.state.type === SECTIONTYPE.PLAYLIST) {
       const playlistHeader = document.querySelector("#playlist-header");
       if (headerOpacity >= 60) {
           playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
           playlistHeader.classList.remove("mx-8");
           playlistHeader.style.top = `${header.offsetHeight}px`;

       } else {
           playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
           playlistHeader.classList.add("mx-8");
           playlistHeader.style.top = `revert`;

       }

   }

}


const loadSections = (section) => {
   if(section.type === SECTIONTYPE.DASHBOARD){
      fillContentForDashboard()
      loadPlaylists()
   } else if (section.type === SECTIONTYPE.PLAYLIST ) {
      //load the elements for playlist
      fillContentForPlaylist(section.playlist)
   }
   document.querySelector(".content").removeEventListener("scroll" , onContentScroll)
   document.querySelector(".content").addEventListener("scroll" , onContentScroll)
}


document.addEventListener("DOMContentLoaded" , async () =>{
 
   const volume = document.querySelector("#volume")
   const audioControl = document.querySelector("#audio-control")
   const playButton = audioControl.querySelector("#play")
   const songDurationCompleted = document.querySelector("#song-duration-completed")
   const songProgress = document.querySelector("#progress")
   const timeline = document.querySelector("#timeline")
   const next = document.querySelector("#next")
   const prev = document.querySelector("#prev")
   let progressInterval

  ({displayName} = await loadUserProfile())
 const section = { type : SECTIONTYPE.DASHBOARD }
//const section = { type : SECTIONTYPE.PLAYLIST , playlist : "37i9dQZF1DWXVJK4aT7pmk" }

 history.pushState(section , "" , "")
//   history.pushState(section , "" , `playlist/${section.playlist}`)
   
   loadSections(section)
   
   document.addEventListener("click" , () => {
      const profileMenu = document.querySelector("#profile-menu") 
      if (!profileMenu.classList.contains("hidden")){
         profileMenu.classList.remove("hidden")
      }
   })
   audio.addEventListener("play" , () => { 
      const selectedTrackId = audioControl.getAttribute("data-track-id")
      console.log(selectedTrackId);
      const tracks = document.querySelector("#tracks")
      const playingTrack = tracks?.querySelector("section.playing")
      const selectedTrack = tracks?.querySelector(`[id="${selectedTrackId}"]`)
      if(playingTrack?.id !== selectedTrack?.id){
         playingTrack?.classList.remove("playing")
      }
      selectedTrack?.classList.add("playing")
      progressInterval = setInterval(() => {
         if(audio.paused)
         {
            return
         }
         songDurationCompleted.textContent = `${audio.currentTime.toFixed(0)<10 ? "0:0" + audio.currentTime.toFixed(0): "0:" + audio.currentTime.toFixed(0)}`
         songProgress.style.width = `${(audio.currentTime / audio.duration) * 100}%`
      }, 100);
      updateIconsForPlayMode(selectedTrackId)
   })
   
   audio.addEventListener("pause" , () =>{
      if(progressInterval){
         clearInterval(progressInterval)
      }
      const selectedTrackId = audioControl.getAttribute("data-track-id")
      updateIconsForPauseMode(selectedTrackId)
   })
   
   audio.addEventListener("loadedmetadata" , onAudioMetaDataLoaded )
   playButton.addEventListener("click" ,  togglePlay )
   


   volume.addEventListener("change" , () => {
       audio.volume = volume.value / 100
   })

   timeline.addEventListener("click" , (e) => {
      const timelineWidth = window.getComputedStyle(timeline).width
      const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration
      audio.currentTime = timeToSeek 
      songProgress.style.width = `${(audio.currentTime / audio.duration) *100}%`
   }, false)

   next.addEventListener("click" , playNextTrack)

   prev.addEventListener("click" , playPrevTrack)

   window.addEventListener("popstate" , (event) => {
     loadSections(event.state)
  })

})