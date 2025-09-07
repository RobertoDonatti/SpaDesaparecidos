import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    
    return (
        <header className="header-container">
            <div className="header-content">
                <div className="header-logo">
                    <div className="header-logo-icon">
                        🔍
                    </div>
                    <div className="header-logo-text">
                        <h1 className="header-title">Pessoas Desaparecidas</h1>
                        <p className="header-subtitle">Polícia Judiciária Civil - Estado de Mato Grosso</p>
                    </div>
                </div>
                
                <nav className="header-nav">
                    <Link 
                        to="/" 
                        className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Início
                    </Link>
                    <Link 
                        to="/sobre" 
                        className={`header-nav-link ${location.pathname === '/sobre' ? 'active' : ''}`}
                    >
                        Sobre
                    </Link>
                    <Link 
                        to="/contato" 
                        className={`header-nav-link ${location.pathname === '/contato' ? 'active' : ''}`}
                    >
                        Contato
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;