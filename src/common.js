export const ACCESS_TOKEN = "ACCESS_TOKEN"
export const TOKEN_TYPE = 'TOKEN_TYPE'
export const EXPIRES_IN = "EXPIRES_IN"
export const APP_URL1 = "http://localhost:5173"


export const ENDPOINT = {
    userinfo: "me" ,
    featuredPlaylist : "browse/featured-playlists?limit=5 "
}


export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(EXPIRES_IN)
    localStorage.removeItem(TOKEN_TYPE)
    window.location.href = APP_URL1

}
