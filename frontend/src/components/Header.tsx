import { Link } from "react-router-dom";

export default function Header(){

    return (
        <div>
            <nav className="nav">
                <h5><Link to="/config-ui">Configuration Management</Link></h5>
            </nav>
        </div>
    ); 
}