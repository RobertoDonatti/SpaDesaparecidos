function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-main">
                    <div className="footer-section">
                        <h3 className="footer-section-title">Sobre o Sistema</h3>
                        <p className="footer-section-text">
                            Sistema de consulta pública para localização de pessoas desaparecidas 
                            do Estado de Mato Grosso. Desenvolvido para auxiliar famílias e 
                            autoridades na busca por pessoas desaparecidas.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="footer-social-link" title="Facebook">
                                📘
                            </a>
                            <a href="#" className="footer-social-link" title="Instagram">
                                📷
                            </a>
                            <a href="#" className="footer-social-link" title="WhatsApp">
                                💬
                            </a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h3 className="footer-section-title">Links Úteis</h3>
                        <div className="footer-links">
                            <a href="#" className="footer-link">Como denunciar</a>
                            <a href="#" className="footer-link">Estatísticas</a>
                            <a href="#" className="footer-link">FAQ - Perguntas Frequentes</a>
                            <a href="#" className="footer-link">Política de Privacidade</a>
                            <a href="#" className="footer-link">Termos de Uso</a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h3 className="footer-section-title">Contato</h3>
                        <div className="footer-links">
                            <span className="footer-section-text">📞 Emergência: 190</span>
                            <span className="footer-section-text">📞 Disque Denúncia: 181</span>
                            <span className="footer-section-text">📧 contato@policiacivil.mt.gov.br</span>
                            <span className="footer-section-text">🏢 Cuiabá - Mato Grosso</span>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        &copy; {currentYear} Polícia Judiciária Civil do Estado de Mato Grosso. 
                        Todos os direitos reservados.
                    </p>
                    <p className="footer-credits">
                        Sistema desenvolvido para fins educacionais e de consulta pública.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;