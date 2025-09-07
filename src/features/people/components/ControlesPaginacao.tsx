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
	// CORREÇÃO: Mostrar controles mesmo se há apenas 1 página (para feedback do usuário)
	if (totalRegistros === 0) {
		return null; // Só ocultar se não há registros
	}
	
	// Calcular quais números de página mostrar
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
	
	const estiloTextoInfo: React.CSSProperties = {
		fontSize: '14px',
		color: '#6b7280',
		marginLeft: '16px'
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
			
			{/* Informações sobre registros */}
			<div style={estiloTextoInfo}>
				Página {paginaAtual} de {totalPaginas} • {totalRegistros} registros
			</div>
		</div>
	);
}

// Função auxiliar para calcular quais páginas mostrar
function calcularPaginasVisiveis(paginaAtual: number, totalPaginas: number): (number | string)[] {
	const paginasVisiveis: (number | string)[] = [];
	
	// Se temos poucas páginas, mostrar todas
	if (totalPaginas <= 7) {
		for (let i = 1; i <= totalPaginas; i++) {
			paginasVisiveis.push(i);
		}
		return paginasVisiveis;
	}
	
	// Sempre mostrar primeira página
	paginasVisiveis.push(1);
	
	// Calcular intervalo ao redor da página atual
	const inicio = Math.max(2, paginaAtual - 1);
	const fim = Math.min(totalPaginas - 1, paginaAtual + 1);
	
	// Adicionar "..." se necessário antes do intervalo
	if (inicio > 2) {
		paginasVisiveis.push('...');
	}
	
	// Adicionar páginas do intervalo
	for (let i = inicio; i <= fim; i++) {
		paginasVisiveis.push(i);
	}
	
	// Adicionar "..." se necessário depois do intervalo
	if (fim < totalPaginas - 1) {
		paginasVisiveis.push('...');
	}
	
	// Sempre mostrar última página
	if (totalPaginas > 1) {
		paginasVisiveis.push(totalPaginas);
	}
	
	return paginasVisiveis;
}
