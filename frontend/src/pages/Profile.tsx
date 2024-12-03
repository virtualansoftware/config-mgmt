import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

export default function Profile() {
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editProfile, setEditProfile] = useState(false);
    const [profilePic, setProfilePic] = useState("/images/logo.png");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user-details") || '{}');
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
        setProfilePic(user.picture || user.profilePic || "/images/logo.png");
    }, []);

    function handleEditProfile(){
        setEditProfile(!editProfile);
    }

    const handleProfilePicChange = (e:any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveDetails = () => {
        const updatedUser = { name, firstName, lastName, email, password, profilePic };
        localStorage.setItem("user-details", JSON.stringify(updatedUser));
        setEditProfile(false);
        toast.success("Profile details updated");
    };

    return (
        <div className="config">
            <div className="profile-container">
                <div className="profile-head">
                    <h5>Profile</h5>
                    <i className="fa-solid fa-pen-to-square" onClick={handleEditProfile}></i>
                </div><hr/>
                <div className="profile-content">
                    <div className="profile-img-container">
                        <img src={profilePic} alt="profilePic" />
                        <input 
                            type="file" 
                            id="file-input"
                            accept="image/*" 
                            disabled={!editProfile}
                            onChange={handleProfilePicChange} 
                        />
                        {editProfile && (
                            <label htmlFor="file-input">
                                <i className="fa-solid fa-camera"></i>
                            </label>
                        )}
                    </div>
                    <p>{firstName || name} {lastName}</p>
                    <div className="profile-details">
                        <div className="offEdit">
                            <div className="detail-row">
                                <label>First Name</label>
                                <input 
                                    type="text" 
                                    value={firstName}
                                    disabled={!editProfile} 
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="detail-row">
                                <label>Last Name</label>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    disabled={!editProfile}
                                    onChange={(e) => setLastName(e.target.value)} 
                                />
                            </div>
                            <div className="detail-row">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    disabled={!editProfile}
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                            <div className="detail-row">
                                <label>Password</label>
                                <input 
                                    type="password"
                                    value={password} 
                                    disabled={!editProfile}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                            <button className="btn btn-success" onClick={handleSaveDetails} disabled={!editProfile}>Save Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}