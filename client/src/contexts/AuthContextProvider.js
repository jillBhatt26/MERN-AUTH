// hooks imports
import { createContext, useReducer } from 'react';

// reducer imports
import rootReducer from '../reducers/rootReducer';

// create and export a context
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const initState = {
        user_id: '',
        username: '',
        jwt: '',
        isAuth: false
    };

    const [user, dispatch] = useReducer(rootReducer, initState);

    return (
        <AuthContext.Provider value={{ user, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
