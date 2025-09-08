import React from 'react';

interface FiltrosStatusProps {
	statusAtivo: 'DESAPARECIDO' | 'LOCALIZADO';
	aoAlterarStatus: (status: 'DESAPARECIDO' | 'LOCALIZADO') => void;
}

export function FiltrosStatus({ 
	statusAtivo, 
	aoAlterarStatus
}: FiltrosStatusProps) {
	const estiloContainer: React.CSSProperties = {
		display: 'flex',
		gap: '12px',
		marginBottom: '24px',
		justifyContent: 'center',
		flexWrap: 'wrap',
		padding: '0 20px'
	};

	const estiloBaseButton: React.CSSProperties = {
		padding: '10px 20px',
		border: '2px solid',
		borderRadius: '8px',
		backgroundColor: 'white',
		cursor: 'pointer',
		fontSize: '14px',
		fontWeight: '600',
		transition: 'all 0.3s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: '150px',
		textAlign: 'center',
		flex: '1',
		maxWidth: '250px'
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

	return (
		<div style={estiloContainer}>
			<button 
				style={estiloDesaparecidos}
				onClick={() => aoAlterarStatus('DESAPARECIDO')}
			>
				Pessoas Desaparecidas
			</button>

			<button 
				style={estiloLocalizados}
				onClick={() => aoAlterarStatus('LOCALIZADO')}
			>
				Pessoas Localizadas
			</button>
		</div>
	);
}
