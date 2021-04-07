// component imports
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import SignUpForm from './components/SignUpForm';
import Profile from './components/Profile';
import Error from './components/Error';

// react-router-dom imports
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';

// hooks imports
import { useContext, useEffect } from 'react';

// context imports
import { AuthContext } from './contexts/AuthContextProvider';
import ResetPassword from './components/ResetPassword';

import axios from 'axios';

const App = () => {
    const { user, dispatch } = useContext(AuthContext);

    useEffect(() => {
        // const url = 'https://mernauthentication.herokuapp.com/profile';
        const url = 'http://localhost:5000/profile';

        axios({
            url,
            withCredentials: true
        }).then(res => {
            if (res.data.error) {
                dispatch({
                    type: 'LOGOUT'
                });
            } else if (res.data.username) {
                dispatch({
                    type: 'AUTH',
                    username: res.data.username,
                    user_id: res.data.user_id,
                    auth: true
                });
            }
        });

        // fetch(url, {
        //     credentials: 'include'
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         if (data.error) {
        //             dispatch({
        //                 type: 'LOGOUT'
        //             });
        //         } else if (data.username) {
        //             dispatch({
        //                 type: 'AUTH',
        //                 username: data.username,
        //                 user_id: data.user_id,
        //                 auth: true
        //             });
        //         }
        //     });
    }, []);

    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/">
                    {user.isAuth ? <Redirect to="/profile" /> : <LoginForm />}
                </Route>

                <Route exact path="/signup">
                    {user.isAuth ? <Redirect to="/profile" /> : <SignUpForm />}
                </Route>

                <Route exact path="/profile">
                    {user.isAuth ? <Profile /> : <Redirect to="/" />}
                </Route>

                <Route
                    exact
                    path="/resetPassword/:resetToken"
                    component={ResetPassword}
                />

                <Route path="*" component={Error} />
            </Switch>
        </Router>
    );
};

export default App;
