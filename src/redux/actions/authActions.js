import { LOGIN_FETCH_START, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../types';


// Login Start
export const loginStart = () =>(
    {
        type:LOGIN_FETCH_START
    }
)

//Login Success
export const loginSuccess = (userdata) =>(
    {
        type:LOGIN_SUCCESS,
        payload:userdata
    }
)

//Login Failure
export const loginFailure = (error) =>(
    { 
       type:LOGIN_FAILURE,
       payload:error
    }
)

//Logout action
export const logout = () =>(
    {
       type:LOGOUT
    }
)
