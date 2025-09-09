import React from 'react';

interface ControlesPaginacaoProps {
	paginaAtual: number;
	totalPaginas: number;
	totalRegistros: number;
	irParaPagina: (pagina: number) => void;
	irParaPaginaAnterior: () => void;
	irParaProximaPagina: () => void;
	irParaPrimeiraPagina: () => void;
	irParaUltimaPagina: () => void;
	temPaginaAnterior: boolean;
	temProximaPagina: boolean;
}

export function ControlesPaginacao({
	paginaAtual,
	totalPaginas,
	totalRegistros,
	irParaPagina,
	irParaPaginaAnterior,
	irParaProximaPagina,
	irParaPrimeiraPagina,
	irParaUltimaPagina,
	temPaginaAnterior,
	temProximaPagina
}: ControlesPaginacaoProps) {
	if (totalRegistros === 0) {
		return null; // Só ocultar se não há registros
	}
	
	const paginasParaMostrar = calcularPaginasVisiveis(paginaAtual, totalPaginas);
	
	const estiloContainer: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '12px',
		padding: '24px 0',
		borderTop: '1px solid #e5e7eb',
		marginTop: '32px'
	};
	
	const estiloBotao: React.CSSProperties = {
		padding: '8px 12px',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: '#d1d5db',
		backgroundColor: '#ffffff',
		color: '#374151',
		borderRadius: '6px',
		cursor: 'pointer',
		fontSize: '14px',
		fontWeight: '500',
		transition: 'all 0.2s ease',
		minWidth: '40px',
		textAlign: 'center'
	};
	
	const estiloBotaoAtivo: React.CSSProperties = {
		...estiloBotao,
		backgroundColor: '#dc2626',
		color: '#ffffff',
		borderColor: '#dc2626'
	};
	
	const estiloBotaoDesabilitado: React.CSSProperties = {
		...estiloBotao,
		opacity: 0.5,
		cursor: 'not-allowed'
	};
	
	return (
		<div style={estiloContainer}>
			{/* Botão primeira página */}
			<button
				onClick={irParaPrimeiraPagina}
				disabled={!temPaginaAnterior}
				style={temPaginaAnterior ? estiloBotao : estiloBotaoDesabilitado}
				title="Primeira página"
			>
				«
			</button>
			
			{/* Botão página anterior */}
			<button
				onClick={irParaPaginaAnterior}
				disabled={!temPaginaAnterior}
				style={temPaginaAnterior ? estiloBotao : estiloBotaoDesabilitado}
				title="Página anterior"
			>
				‹
			</button>
			
			{/* Números das páginas */}
			{paginasParaMostrar.map((numeroPagina, index) => {
				if (numeroPagina === '...') {
					return (
						<span key={`ellipsis-${index}`} style={{ color: '#9ca3af', padding: '0 4px' }}>
							...
						</span>
					);
				}
				
				const numero = Number(numeroPagina);
				const estaAtiva = numero === paginaAtual;
				
				return (
					<button
						key={numero}
						onClick={() => irParaPagina(numero)}
						style={estaAtiva ? estiloBotaoAtivo : estiloBotao}
						title={`Página ${numero}`}
					>
						{numero}
					</button>
				);
			})}
			
			{/* Botão próxima página */}
			<button
				onClick={irParaProximaPagina}
				disabled={!temProximaPagina}
				style={temProximaPagina ? estiloBotao : estiloBotaoDesabilitado}
				title="Próxima página"
			>
				›
			</button>
			
			{/* Botão última página */}
			<button
				onClick={irParaUltimaPagina}
				disabled={!temProximaPagina}
				style={temProximaPagina ? estiloBotao : estiloBotaoDesabilitado}
				title="Última página"
			>
				»
			</button>
		</div>
	);
}

function calcularPaginasVisiveis(paginaAtual: number, totalPaginas: number): (number | string)[] {
	const paginasVisiveis: (number | string)[] = [];
	
	if (totalPaginas <= 7) {
		for (let i = 1; i <= totalPaginas; i++) {
			paginasVisiveis.push(i);
		}
		return paginasVisiveis;
	}
	
	paginasVisiveis.push(1);
	
	const inicio = Math.max(2, paginaAtual - 1);
	const fim = Math.min(totalPaginas - 1, paginaAtual + 1);
	
	if (inicio > 2) {
		paginasVisiveis.push('...');
	}
	
	for (let i = inicio; i <= fim; i++) {
		paginasVisiveis.push(i);
	}
	
	if (fim < totalPaginas - 1) {
		paginasVisiveis.push('...');
	}
	
	if (totalPaginas > 1) {
		paginasVisiveis.push(totalPaginas);
	}
	
	return paginasVisiveis;
}
