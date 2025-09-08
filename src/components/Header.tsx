import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/home" className="header-logo">
                    <div className="header-logo-icon">
                        🔍
                    </div>
                    <div className="header-logo-text">
                        <h1 className="header-title">Pessoas Desaparecidas</h1>
                    </div>
                </Link>
            </div>
        </header>
    );
}

export default Header;