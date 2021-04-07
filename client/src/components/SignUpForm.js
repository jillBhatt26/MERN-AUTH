// hooks imports
import { useState, useContext } from 'react';

// react-router-dom imports
import { useHistory } from 'react-router-dom';

// context imports
import { AuthContext } from '../contexts/AuthContextProvider';

import axios from 'axios';

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePass, setRePass] = useState('');

    const [usernameError, setUsernameError] = useState(null);
    const [passError, setPassError] = useState(null);

    const { dispatch } = useContext(AuthContext);

    const history = useHistory();

    const handleSubmit = event => {
        event.preventDefault();

        setUsernameError(null);
        setPassError(null);

        if (
            username === '' ||
            email === '' ||
            password === '' ||
            rePass === ''
        ) {
            alert('All fields required!!');
        } else {
            if (password === rePass) {
                // const url = `http://localhost:5000/signup`;
                const url = `https://mernauthentication.herokuapp.com/signup`;

                axios({
                    url,
                    method: 'POST',
                    data: {
                        username,
                        email,
                        password
                    },
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => {
                        const { data } = res;

                        if (data.error) {
                            // errors exist
                            setUsernameError(data.error.username);
                        } else {
                            const { id, username } = data;

                            dispatch({
                                type: 'SIGNUP',
                                id,
                                username,
                                isAuth: true
                            });

                            // NOTE: Never store jwt in localStorage due to vulnerability from CSRF token.
                            // localStorage.setItem('token', jwt);

                            history.push('/profile');
                        }
                    })
                    .catch(err => console.log(err));
            } else {
                setPassError("Passwords don't match.");
            }
        }
    };

    return (
        <div className="container">
            <h3 className="center">Sign Up</h3>

            <div className="row">
                <form
                    autoComplete="off"
                    className="col s12 m6 offset-m3"
                    onSubmit={handleSubmit}
                >
                    <div className="input-field">
                        <input
                            type="text"
                            name="credentials"
                            placeholder="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        {usernameError && (
                            <span className="red-text">{usernameError}</span>
                        )}
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="credentials"
                            placeholder="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        {passError && (
                            <span className="red-text">{passError}</span>
                        )}
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            name="rePassword"
                            placeholder="Retype Password"
                            value={rePass}
                            onChange={e => setRePass(e.target.value)}
                        />
                        {passError && (
                            <span className="red-text">{passError}</span>
                        )}
                    </div>

                    <div className="center">
                        <button className="btn waves-effect waves-dark btn-lg green">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
