import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLUListElement | null>(null);
    const profileRef = useRef<HTMLParagraphElement | null>(null);

    const toggleMenu = () => {
        setShowMenu(showMenu ? null : "open");
    };

    const closeMenu = () => {
        setShowMenu(null);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node) && profileRef.current && !profileRef.current.contains(e.target as Node)) {
            closeMenu();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function handleProfile() {
        navigate("/profile");
        closeMenu();
    }

    function handleSettings() {
        navigate("/settings");
        closeMenu();
    }

    function handleLogout() {
        navigate("/login");
        closeMenu();
    }

    return (
        <div>
            <nav className="nav">
                <div className="logo">
                    <img src="/images/logo_image.png" alt="Configuran Logo"/>
                    <h4>Configuran</h4>
                </div>
                {location.pathname !== "/login" && location.pathname !== "/register" && (
                    <div className="profile">
                        <div ref={profileRef} onClick={toggleMenu}>
                            <i className="fa-solid fa-user-circle"></i>
                        </div>
                        {showMenu && (
                            <ul ref={menuRef} className={`profile-menu ${showMenu ? 'open' : ''}`}>
                                <li onClick={handleProfile}><i className="fa-solid fa-user"></i> Profile</li>
                                <li onClick={handleSettings}><i className="fa-solid fa-screwdriver-wrench"></i> Settings</li>
                                <li onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Logout</li>
                            </ul>
                        )}
                    </div>
                )}
            </nav>
            {showMenu && <div className="profile-overlay"></div>}
        </div>
    ); 
}