import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { buscarEstatisticas } from '../api';

export function DashboardEstatisticas() {
	const {
		data: estatisticas,
		isLoading: carregandoEstatisticas,
		error: erroEstatisticas
	} = useQuery({
		queryKey: ['estatisticas-pessoas'],
		queryFn: buscarEstatisticas,
		staleTime: 1000 * 60 * 5, // 5 minutos
		retry: 2
	});

	if (carregandoEstatisticas) {
		return (
			<div style={estiloContainer}>
				<div style={estiloCard}>
					<div style={estiloSkeleton} />
					<div style={estiloSkeletonTexto} />
				</div>
				<div style={estiloCard}>
					<div style={estiloSkeleton} />
					<div style={estiloSkeletonTexto} />
				</div>
			</div>
		);
	}

	if (erroEstatisticas) {
		return (
			<div style={estiloContainer}>
				<div style={{...estiloCard, borderColor: '#ef4444'}}>
					<p style={{color: '#ef4444', margin: 0}}>
						❌ Erro ao carregar estatísticas
					</p>
				</div>
			</div>
		);
	}

	const total = (estatisticas?.quantPessoasDesaparecidas || 0) + (estatisticas?.quantPessoasEncontradas || 0);
	const percentualEncontradas = total > 0 ? ((estatisticas?.quantPessoasEncontradas || 0) / total * 100).toFixed(1) : '0';

	return (
		<div style={estiloContainer}>
			{/* Card Desaparecidas */}
			<div style={{...estiloCard, borderLeftColor: '#dc2626'}}>
				<div style={estiloIcone}>
					<span style={{fontSize: '24px'}}>🔍</span>
				</div>
				<div style={estiloConteudo}>
					<h3 style={estiloTitulo}>Pessoas Desaparecidas</h3>
					<p style={{...estiloNumero, color: '#dc2626'}}>
						{estatisticas?.quantPessoasDesaparecidas?.toLocaleString() || '0'}
					</p>
					<p style={estiloSubtitulo}>Ainda procurando</p>
				</div>
			</div>

			{/* Card Encontradas */}
			<div style={{...estiloCard, borderLeftColor: '#16a34a'}}>
				<div style={estiloIcone}>
					<span style={{fontSize: '24px'}}>✅</span>
				</div>
				<div style={estiloConteudo}>
					<h3 style={estiloTitulo}>Pessoas Localizadas</h3>
					<p style={{...estiloNumero, color: '#16a34a'}}>
						{estatisticas?.quantPessoasEncontradas?.toLocaleString() || '0'}
					</p>
					<p style={estiloSubtitulo}>
						{percentualEncontradas}% do total
					</p>
				</div>
			</div>
		</div>
	);
}

// Estilos
const estiloContainer: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
	gap: '20px',
	marginBottom: '32px'
};

const estiloCard: React.CSSProperties = {
	backgroundColor: '#ffffff',
	borderRadius: '12px',
	padding: '20px',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#e5e7eb',
	borderLeftWidth: '4px',
	boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
	display: 'flex',
	alignItems: 'center',
	gap: '16px'
};

const estiloIcone: React.CSSProperties = {
	width: '48px',
	height: '48px',
	backgroundColor: '#f9fafb',
	borderRadius: '8px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
};

const estiloConteudo: React.CSSProperties = {
	flex: 1
};

const estiloTitulo: React.CSSProperties = {
	margin: '0 0 8px 0',
	fontSize: '14px',
	fontWeight: '500',
	color: '#6b7280',
	textTransform: 'uppercase',
	letterSpacing: '0.05em'
};

const estiloNumero: React.CSSProperties = {
	margin: '0 0 4px 0',
	fontSize: '24px',
	fontWeight: '700',
	lineHeight: '1'
};

const estiloSubtitulo: React.CSSProperties = {
	margin: 0,
	fontSize: '12px',
	color: '#9ca3af'
};

const estiloSkeleton: React.CSSProperties = {
	width: '48px',
	height: '48px',
	backgroundColor: '#f3f4f6',
	borderRadius: '8px',
	animation: 'pulse 2s infinite'
};

const estiloSkeletonTexto: React.CSSProperties = {
	height: '20px',
	backgroundColor: '#f3f4f6',
	borderRadius: '4px',
	animation: 'pulse 2s infinite'
};
