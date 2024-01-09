import { ENDPOINT } from "../common"
import { FetchRequest } from "../api"

const loadUserProfile = async() => {
 const defaultImage = document.querySelector("#default-image")
 const profileButton = document.querySelector("#user-profile-button")
 const displayNameElement = document.querySelector("#display-name")
 const userInfo = await FetchRequest(ENDPOINT.userinfo)
 console.log(userInfo);

}

document.addEventListener("DOMContentLoaded" , () =>{
loadUserProfile()
})