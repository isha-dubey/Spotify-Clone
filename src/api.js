import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "./common"

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL

const getAccessToken = () => {
    
    const accessToken =localStorage.getItem(ACCESS_TOKEN)
    const tokenType =localStorage.getItem(TOKEN_TYPE)
    const expiresIn =localStorage.getItem(EXPIRES_IN)
    if(Date.now() , expiresIn ){
        return(accessToken ,tokenType )
    }
    else{
        
    }

}

const fetchRequest = () =>{
  const url = `${BASE_API_URL}/${endpoint}`
  fetch(url , {
    headers
  })
}


