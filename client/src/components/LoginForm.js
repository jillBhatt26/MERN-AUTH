// hooks
import { useState, useContext } from 'react';

// context
import { AuthContext } from '../contexts/AuthContextProvider';

// react-router-dom
import { useHistory, Link } from 'react-router-dom';

// axios
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const [hasForgot, setHasForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetEmailError, setResetEmailError] = useState(null);

    const { dispatch } = useContext(AuthContext);

    const history = useHistory();

    const handleLoginSubmit = event => {
        event.preventDefault();

        setUsernameError(null);
        setPasswordError(null);

        if (username === '' || password === '') {
            alert('Please enter all fields.');
        } else {
            // authenticate the user
            // const url = 'http://localhost:5000/login';
            const url = `https://mernauthentication.herokuapp.com/login`;

            axios({
                url,
                method: 'POST',
                data: {
                    username,
                    password
                },
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    if (res.data.error) {
                        const { username, password } = res.data.error;

                        if (username) setUsernameError(username);
                        if (password) setPasswordError(password);
                    } else {
                        dispatch({
                            type: 'LOGIN',
                            id: res.data.id,
                            username: res.data.username,
                            isAuth: true
                        });

                        // NOTE: Never store the jwt in localStorage since localStorage can be vulnerable to CSRF attacks.
                        // localStorage.setItem('token', data.jwt);

                        history.push('/profile');
                    }
                })
                .catch(err => console.log(err));
        }
    };

    const HandlePasswordResetSubmit = event => {
        event.preventDefault();

        // const url = `http://localhost:5000/requestResetPassword`;
        const url = `https://mernauthentication.herokuapp.com/requestResetPassword`;

        axios({
            url,
            method: 'POST',
            data: {
                email: resetEmail
            },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                const { errMsg, success, msg } = res.data;

                if (errMsg) {
                    setResetEmailError(errMsg);
                } else {
                    if (success) {
                        history.push('/');

                        alert(msg);
                    }
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container">
            <h3 className="center">Login</h3>

            <div className="row">
                {hasForgot ? (
                    <form
                        className="col s12 m6 offset-m3"
                        autoComplete="off"
                        onSubmit={HandlePasswordResetSubmit}
                    >
                        <div className="input-field">
                            <input
                                type="email"
                                placeholder="Reset Email"
                                value={resetEmail}
                                onChange={e => {
                                    setResetEmail(e.target.value);
                                    setResetEmailError(null);
                                }}
                            />
                            {resetEmailError && (
                                <p style={{ color: 'red' }}>
                                    {resetEmailError}
                                </p>
                            )}
                        </div>

                        <div className="center">
                            <button className="btn waves-effect waves-dark btn-lg green">
                                <i className="material-icons right">email</i>
                                Send Mail
                            </button>
                        </div>

                        <div className="center" style={{ margin: '50px 0' }}>
                            <Link
                                to=""
                                onClick={() => setHasForgot(false)}
                                style={{ color: 'red' }}
                            >
                                Go back
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form
                        autoComplete="off"
                        className="col s12 m6 offset-m3"
                        onSubmit={handleLoginSubmit}
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
                                <span className="red-text">
                                    {usernameError}
                                </span>
                            )}
                        </div>
                        <div className="input-field">
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {passwordError && (
                                <span className="red-text">
                                    {passwordError}
                                </span>
                            )}
                        </div>
                        <div className="center" style={{ margin: '50px 0' }}>
                            <Link
                                to=""
                                onClick={() => setHasForgot(true)}
                                style={{ color: 'red' }}
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="center">
                            <button className="btn waves-effect waves-dark btn-lg green">
                                <i className="material-icons right">login</i>
                                login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
