import { useState, useEffect } from 'react';

import { userService } from '../services/user.service';

export default Home;

function Home() {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        userService.getAll().then(x => setUsers(x));
    }, []);

    var username = JSON.parse(localStorage.getItem("user"));
    console.log(username);
    // console.log(localStorage.getItem("user"))

    return (
        <div className="card mt-4">
            <h4 className="card-header">Wellcome {(username.username)}</h4>
            <div className="card-body">
                <h6>Users from secure api end point</h6>
                {users &&
                    <ul>
                        {users.map(user =>
                            <li key={user.id}>{user.firstName} {user.lastName}</li>
                        )}
                    </ul>
                }
                {!users && <div className="spinner-border spinner-border-sm"></div>}
            </div>
        </div>
    );
}