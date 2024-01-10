import { ACCESS_TOKEN, EXPIRES_IN, logout, TOKEN_TYPE } from "./common"

const BASE_API_URL = 'https://api.spotify.com/v1'

const getAccessToken = () => {
    
    const accessToken =localStorage.getItem(ACCESS_TOKEN)
    const tokenType =localStorage.getItem(TOKEN_TYPE)
    const expiresIn =localStorage.getItem(EXPIRES_IN)
    if( Date.now() < expiresIn ){
         {accessToken ,tokenType }
    }
    else{
        logout()
    }
}

 export const createAPIConfig = ({accessToken , tokenType} , method="GET") => {
    return  { 
        headers : {
            Authorization : `${tokenType} ${accessToken}`
        }
    }
}

export const FetchRequest = async (endpoint) =>{
  const url = `${BASE_API_URL}/${endpoint}`
  const result = await fetch(url , createAPIConfig(getAccessToken()))
  return result.json()
}


