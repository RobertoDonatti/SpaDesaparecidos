import React from 'react';

export function LoadingSkeleton() {
	const estiloContainer: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)', // 4 colunas
		gridTemplateRows: 'repeat(3, 1fr)',    // 3 linhas
		gap: 16,
		maxWidth: 1200,
		margin: '0 auto',
		minHeight: '450px'
	};
	
	const estiloSkeleton: React.CSSProperties = {
		backgroundColor: '#f3f4f6',
		borderRadius: '8px',
		padding: '16px',
		minHeight: '120px',
		animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
	};
	
	const estiloTextoSkeleton: React.CSSProperties = {
		height: '12px',
		backgroundColor: '#e5e7eb',
		borderRadius: '4px',
		marginBottom: '8px'
	};
	
	return (
		<div style={{ padding: 20 }}>
			{/* Cabeçalho skeleton */}
			<div style={{ 
				textAlign: 'center', 
				marginBottom: 20 
			}}>
				<div style={{
					height: '24px',
					backgroundColor: '#e5e7eb',
					borderRadius: '4px',
					margin: '0 auto 20px',
					maxWidth: '300px'
				}} />
				<div style={{
					height: '14px',
					backgroundColor: '#f3f4f6',
					borderRadius: '4px',
					margin: '0 auto',
					maxWidth: '200px'
				}} />
			</div>
			
			{/* Grid skeleton */}
			<div style={estiloContainer}>
				{Array.from({ length: 12 }).map((_, index) => (
					<div key={index} style={estiloSkeleton}>
						{/* Imagem skeleton */}
						<div style={{
							height: '60px',
							backgroundColor: '#e5e7eb',
							borderRadius: '4px',
							marginBottom: '12px'
						}} />
						
						{/* Textos skeleton */}
						<div style={estiloTextoSkeleton} />
						<div style={{
							...estiloTextoSkeleton,
							width: '80%'
						}} />
						<div style={{
							...estiloTextoSkeleton,
							width: '60%'
						}} />
					</div>
				))}
			</div>
			
			<style>{`
				@keyframes pulse {
					0%, 100% {
						opacity: 1;
					}
					50% {
						opacity: .5;
					}
				}
			`}</style>
		</div>
	);
}
