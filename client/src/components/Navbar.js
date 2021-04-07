// hooks imports
import { useContext } from 'react';

// context imports
import { AuthContext } from '../contexts/AuthContextProvider';

// react-router-dom
import { Link, NavLink, useHistory } from 'react-router-dom';

const Navbar = () => {
    const { user, dispatch } = useContext(AuthContext);

    const history = useHistory();

    const handleLogout = () => {
        // const url = `http://localhost:5000/logout`;
        const url = `https://mernauthentication.herokuapp.com/logout`;

        fetch(url, {
            method: 'POST',
            credentials: 'include'
        })
            .then(() => {
                dispatch({ type: 'LOGOUT' });
                localStorage.removeItem('token');
                history.push('/');
            })
            .catch(err => console.log(err));
    };

    return user.isAuth ? (
        <nav>
            <div className="nav-wrapper blue darken-3">
                <div className="container">
                    <Link to="/" className="brand-logo">
                        Mern-Auth
                    </Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>Hello, {user.username}!</li>
                        <li>
                            <NavLink to="" onClick={handleLogout}>
                                Logout
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    ) : (
        <nav>
            <div className="nav-wrapper blue darken-3">
                <div className="container">
                    <Link to="/" className="brand-logo">
                        Mern-Auth
                    </Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <NavLink to="/signup">Sign Up</NavLink>
                        </li>
                        <li>
                            <NavLink to="/">Log In</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
