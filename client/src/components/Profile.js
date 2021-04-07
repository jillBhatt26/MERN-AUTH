// react-router-dom imports
import { useHistory } from 'react-router-dom';

// import context
import { AuthContext } from '../contexts/AuthContextProvider';

// import hooks
import { useContext, useEffect } from 'react';

// axios
import axios from 'axios';

const Profile = () => {
    const { user } = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        const url = `https://mernauthentication.herokuapp.com/profile`;
        // const url = `http://localhost:5000/profile`;

        axios({
            url,
            withCredentials: true
        })
            .then(res => {
                const { data } = res;

                if (data.error) {
                    history.push('/');
                }
            })
            .catch(err => console.log(err));

        // NOTE: The below log statement is used to demonstrate the security of the jwt stored in cookie.
        console.log(document.cookies);
    }, []);

    return (
        <div className="container">
            <h3 className="center">{user.username}&apos;s profile</h3>
        </div>
    );
};

export default Profile;
