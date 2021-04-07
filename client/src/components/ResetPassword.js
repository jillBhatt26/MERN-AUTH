// hooks
import { useState, useEffect } from 'react';

// react-router-dom
import { useParams, useHistory } from 'react-router-dom';

// axios
import axios from 'axios';

const ResetPassword = () => {
    // fetch the reset token from params
    const { resetToken } = useParams();

    const history = useHistory();

    // states
    const [newPassword, setNewPassword] = useState('');
    const [isAllowed, setIsAllowed] = useState(false);
    const [userId, setUserId] = useState(null);

    // componentDidMount
    useEffect(() => {
        // check if the token has not yet expired.
        // If token has expired redirect to login.

        const url = `https://mernauthentication.herokuapp.com/resetPassword/${resetToken}`;
        // const url = `http://localhost:5000/resetPassword/${resetToken}`;

        axios({
            url
        })
            .then(res => {
                const { success, errMsg, user_id } = res.data;

                if (errMsg) {
                    alert(errMsg);
                    history.push('/');
                } else if (success) {
                    setIsAllowed(true);
                    setUserId(user_id);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const HandlePasswordReset = event => {
        event.preventDefault();

        const url = `https://mernauthentication.herokuapp.com/resetPassword`;
        // const url = `http://localhost:5000/resetPassword`;

        axios({
            url,
            method: 'PUT',
            data: {
                user_id: userId,
                new_password: newPassword
            },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                const { success, errMsg, msg } = res.data;

                if (errMsg) {
                    history.push('/');
                    alert(errMsg);
                } else if (success) {
                    alert(msg);

                    history.push('/');
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container">
            <h3 className="center">Reset Your Password</h3>

            <div className="row">
                {isAllowed && (
                    <form
                        className="col s12 m6 offset-m3"
                        autoComplete="off"
                        onSubmit={HandlePasswordReset}
                    >
                        <div className="input-field">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />

                            <div
                                className="center"
                                style={{ margin: '50px 0' }}
                            >
                                <button className="btn waves-effect waves-dark btn-lg green">
                                    <i className="material-icons right">
                                        refresh
                                    </i>
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
