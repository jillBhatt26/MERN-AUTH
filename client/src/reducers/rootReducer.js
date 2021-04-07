const rootReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
        case 'SIGNUP':
            return {
                ...state,
                user_id: action.id,
                username: action.username,
                isAuth: action.isAuth
            };

        case 'LOGOUT':
            return {
                ...state,
                user_id: '',
                username: '',
                isAuth: false
            };

        case 'AUTH':
            return {
                ...state,
                username: action.username,
                isAuth: action.auth
            };

        default:
            return state;
    }
};

export default rootReducer;
