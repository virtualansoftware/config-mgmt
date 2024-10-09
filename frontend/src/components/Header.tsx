import { Link } from "react-router-dom";

export default function Header(){

    return (
        <div>
            <nav className="nav">
                <div className="logo">
                    <img src="/images/logo_image.png" alt="Configuran Logo" width="50px" />
                    <h4>Configuran</h4>
                </div>
                <h5><Link to="/config-mgmt">Configuration Management</Link></h5>
            </nav>
        </div>
    ); 
}