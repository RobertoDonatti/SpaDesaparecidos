import React from 'react';

interface MensagemDadosIndisponiveisProps {
	tipo: 'localizados' | 'outros';
}

export function MensagemDadosIndisponiveis({ tipo }: MensagemDadosIndisponiveisProps) {
	const estiloContainer: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '60px 20px',
		textAlign: 'center',
		backgroundColor: '#f9fafb',
		border: '2px dashed #e5e7eb',
		borderRadius: '12px',
		margin: '20px auto',
		maxWidth: '600px'
	};

	const estiloIcone: React.CSSProperties = {
		fontSize: '64px',
		marginBottom: '16px'
	};

	const estiloTitulo: React.CSSProperties = {
		fontSize: '24px',
		fontWeight: '600',
		color: '#374151',
		marginBottom: '12px'
	};

	const estiloDescricao: React.CSSProperties = {
		fontSize: '16px',
		color: '#6b7280',
		lineHeight: '1.6',
		marginBottom: '20px'
	};

	const estiloObservacao: React.CSSProperties = {
		fontSize: '14px',
		color: '#9ca3af',
		fontStyle: 'italic',
		backgroundColor: '#f3f4f6',
		padding: '12px 16px',
		borderRadius: '8px',
		border: '1px solid #e5e7eb'
	};

	if (tipo === 'localizados') {
		return (
			<div style={estiloContainer}>
				<div style={estiloIcone}>🔒</div>
				<h3 style={estiloTitulo}>Dados de Pessoas Localizadas Não Disponíveis</h3>
				<p style={estiloDescricao}>
					Por questões de <strong>privacidade e segurança</strong>, os dados de pessoas que já foram localizadas 
					não são disponibilizados publicamente através desta plataforma.
				</p>
				<p style={estiloDescricao}>
					As estatísticas mostram o total histórico de <strong>753 pessoas localizadas</strong>, 
					mas apenas casos ativos (ainda desaparecidos) são exibidos para consulta pública.
				</p>
				<div style={estiloObservacao}>
					💡 <strong>Nota:</strong> Esta é uma prática padrão em sistemas policiais para proteger 
					a privacidade das pessoas que foram encontradas.
				</div>
			</div>
		);
	}

	return (
		<div style={estiloContainer}>
			<div style={estiloIcone}>⚠️</div>
			<h3 style={estiloTitulo}>Dados Não Disponíveis</h3>
			<p style={estiloDescricao}>
				Os dados solicitados não estão disponíveis no momento.
			</p>
		</div>
	);
}
