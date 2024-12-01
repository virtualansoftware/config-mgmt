import { useState } from "react";

export default function Profile() {
    const[editProfile, setEditProfile] = useState(false);

    function handleEditProfile(){
        setEditProfile(!editProfile);
    }

    return (
        <div className="config">
            <div className="profile-container">
                <div className="profile-head">
                    <h5>Profile</h5>
                    <i className="fa-solid fa-pen-to-square" onClick={handleEditProfile}></i>
                </div><hr/>
                <div className="profile-content">
                    <img src="/images/logo.png" alt="profilePic" />
                    <p>Fullname</p>
                    <div className="profile-details">
                        <div className="offEdit">
                            <div className="detail-row">
                                <label>First Name</label>
                                <input type="text" value={"firstname"} disabled={!editProfile}/>
                            </div>
                            <div className="detail-row">
                                <label>Last Name</label>
                                <input type="text" value={"lastname"} disabled={!editProfile}/>
                            </div>
                            <div className="detail-row">
                                <label>Email</label>
                                <input type="email" value={"example@gmail.com"} disabled={!editProfile}/>
                            </div>
                            <div className="detail-row">
                                <label>Password</label>
                                <input type="password" value={"12345678"} disabled={!editProfile}/>
                            </div>
                            <button className="btn btn-success">Save Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}