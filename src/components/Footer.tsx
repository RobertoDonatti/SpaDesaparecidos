function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-main">
                    <div className="footer-section">
                        <h3 className="footer-section-title">Sobre o Sistema</h3>
                        <p className="footer-section-text">
                            Projeto avaliativo que implementa um sistema de consulta pública, 
                            o qual consome uma API para exibir informações relacionadas a pessoas 
                            desaparecidas. Ressalta-se que todos os dados retornados pela API são 
                            estritamente fictícios, utilizados unicamente para fins de demonstração 
                            e avaliação, não possuindo qualquer vínculo com casos reais.
                        </p>
                    </div>
                    
                    <div className="footer-section">
                        <h3 className="footer-section-title">Contato</h3>
                        <div className="footer-links">
                            <span className="footer-section-text">Emergência: 190</span>
                            <span className="footer-section-text">Disque Denúncia: 181</span>
                            <span className="footer-section-text">contato@policiacivil.mt.gov.br</span>
                            <span className="footer-section-text">Cuiabá - Mato Grosso</span>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        &copy; {currentYear} Spa Desaparecidos. 
                        Todos os direitos reservados.
                    </p>
                    <p className="footer-credits">
                        Sistema desenvolvido para fins avaliativos e de demonstração.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;