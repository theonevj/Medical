import { LOGIN_FETCH_START, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "../types";
import Cookies from 'js-cookie';

const initialState = {
    user: null || JSON.parse(localStorage.getItem("user")),
    loading:false,
    error:null,
    api_token: null || Cookies.get("user")
}


const authReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_FETCH_START:
            return {
                ...state,
                loading:false
            }
        
        case LOGIN_SUCCESS:
            const {api_token, user} = action.payload
            localStorage.setItem("user",JSON.stringify(user))
            Cookies.set("user", api_token)
            return {
                user,
                api_token,
                loading:false,
                error:null
            }

        case LOGIN_FAILURE:
            localStorage.removeItem('user')
            Cookies.remove('user')
            return {
                user:null,
                api_token:null,
                ...state,
                error:action.payload,   
            }

        case LOGOUT:
            localStorage.removeItem("user")
            Cookies.remove('user')
            return {
                user:null,
                api_token:null,
                loading:false,
                error:null
            }

        default: 
            return state
    }
}

export default authReducer