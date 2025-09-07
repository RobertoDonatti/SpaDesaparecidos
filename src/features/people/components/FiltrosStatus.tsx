import React from 'react';

interface FiltrosStatusProps {
	statusAtivo: 'DESAPARECIDO' | 'LOCALIZADO';
	aoAlterarStatus: (status: 'DESAPARECIDO' | 'LOCALIZADO') => void;
	quantidadeDesaparecidos?: number;
	quantidadeLocalizados?: number;
}

export function FiltrosStatus({ 
	statusAtivo, 
	aoAlterarStatus, 
	quantidadeDesaparecidos = 0,
	quantidadeLocalizados = 0 
}: FiltrosStatusProps) {
	const estiloContainer: React.CSSProperties = {
		display: 'flex',
		gap: '16px',
		marginBottom: '24px',
		justifyContent: 'center',
		flexWrap: 'wrap'
	};

	const estiloBaseButton: React.CSSProperties = {
		padding: '12px 24px',
		border: '2px solid',
		borderRadius: '8px',
		backgroundColor: 'white',
		cursor: 'pointer',
		fontSize: '16px',
		fontWeight: '600',
		transition: 'all 0.3s ease',
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		minWidth: '180px',
		justifyContent: 'center'
	};

	const estiloAtivo: React.CSSProperties = {
		boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
		transform: 'translateY(-2px)'
	};

	const estiloDesaparecidos: React.CSSProperties = {
		...estiloBaseButton,
		borderColor: statusAtivo === 'DESAPARECIDO' ? '#dc2626' : '#e5e7eb',
		color: statusAtivo === 'DESAPARECIDO' ? '#dc2626' : '#6b7280',
		backgroundColor: statusAtivo === 'DESAPARECIDO' ? '#fef2f2' : 'white',
		...(statusAtivo === 'DESAPARECIDO' ? estiloAtivo : {})
	};

	const estiloLocalizados: React.CSSProperties = {
		...estiloBaseButton,
		borderColor: statusAtivo === 'LOCALIZADO' ? '#16a34a' : '#e5e7eb',
		color: statusAtivo === 'LOCALIZADO' ? '#16a34a' : '#6b7280',
		backgroundColor: statusAtivo === 'LOCALIZADO' ? '#f0fdf4' : 'white',
		...(statusAtivo === 'LOCALIZADO' ? estiloAtivo : {})
	};

	const estiloBadge: React.CSSProperties = {
		fontSize: '12px',
		backgroundColor: 'currentColor',
		color: 'white',
		borderRadius: '10px',
		padding: '2px 8px',
		marginLeft: '4px'
	};

	return (
		<div style={estiloContainer}>
			<button 
				style={estiloDesaparecidos}
				onClick={() => aoAlterarStatus('DESAPARECIDO')}
			>
				<span>🔍</span>
				Pessoas Desaparecidas
				<span style={estiloBadge}>
					{quantidadeDesaparecidos}
				</span>
			</button>

			<button 
				style={estiloLocalizados}
				onClick={() => aoAlterarStatus('LOCALIZADO')}
			>
				<span>✅</span>
				Pessoas Localizadas
				<span style={estiloBadge}>
					{quantidadeLocalizados}
				</span>
			</button>
		</div>
	);
}
