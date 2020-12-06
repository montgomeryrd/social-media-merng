import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
};

// Checks Local Storage for Unexpired Token, sees if user is still logged in
if(localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    if (decodedToken.exp * 1000 <  Date.now()) {
        localStorage.removeItem('jwtToken');
    } else {
        initialState.user = decodedToken;
    };
};

const AuthContext = createContext({
    user: null,
    login: (userdata) => {},
    logout: () => {}
});

// Reducers
function authReducer(state, action) {
    switch(action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default: return state;
    }
};

// Dispatch login and logout actions
function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, { initialState });

    const login = userdata => {
        localStorage.setItem('jwtToken', userdata.token);
        dispatch({
            type: 'LOGIN',
            payload: userdata
        });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        dispatch({
            type: 'LOGOUT'
        });
    };

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout}}
            {...props}
        />
    );
};

export { AuthContext, AuthProvider };