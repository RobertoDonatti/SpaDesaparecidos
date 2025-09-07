import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { buscarPessoasPorFiltro } from '../api';
import type { FiltroBusca, Pessoa } from '../types';
import CardPessoa from './CardPessoa';

export function FormularioBusca() {
	const [filtros, setFiltros] = useState<FiltroBusca>({});
	const [buscaAtiva, setBuscaAtiva] = useState(false);

	const {
		data: resultadosBusca,
		isLoading: carregandoBusca,
		error: erroBusca,
		refetch: executarBusca
	} = useQuery({
		queryKey: ['busca-pessoas', filtros],
		queryFn: () => buscarPessoasPorFiltro(filtros),
		enabled: false, // Só executar quando solicitado
		staleTime: 1000 * 60 * 2 // 2 minutos
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// Verificar se pelo menos um filtro foi preenchido
		if (!filtros.nome && !filtros.sexo && !filtros.idadeMinima && !filtros.idadeMaxima) {
			alert('Por favor, preencha pelo menos um campo para buscar');
			return;
		}

		setBuscaAtiva(true);
		executarBusca();
	};

	const handleLimpar = () => {
		setFiltros({});
		setBuscaAtiva(false);
	};

	const handleInputChange = (campo: keyof FiltroBusca, valor: string | number) => {
		setFiltros(prev => ({
			...prev,
			[campo]: valor === '' ? undefined : valor
		}));
	};

	return (
		<div style={estiloContainer}>
			{/* Formulário */}
			<div style={estiloFormulario}>
				<h2 style={estiloTitulo}>🔍 Buscar Pessoa Desaparecida</h2>
				
				<form onSubmit={handleSubmit} style={estiloForm}>
					<div style={estiloGrid}>
						{/* Campo Nome */}
						<div style={estiloCampo}>
							<label style={estiloLabel}>Nome</label>
							<input
								type="text"
								placeholder="Digite o nome da pessoa"
								value={filtros.nome || ''}
								onChange={(e) => handleInputChange('nome', e.target.value)}
								style={estiloInput}
							/>
						</div>

						{/* Campo Sexo */}
						<div style={estiloCampo}>
							<label style={estiloLabel}>Sexo</label>
							<select
								value={filtros.sexo || ''}
								onChange={(e) => handleInputChange('sexo', e.target.value as 'M' | 'F')}
								style={estiloInput}
							>
								<option value="">Todos</option>
								<option value="M">Masculino</option>
								<option value="F">Feminino</option>
							</select>
						</div>

						{/* Campo Idade Mínima */}
						<div style={estiloCampo}>
							<label style={estiloLabel}>Idade Mínima</label>
							<input
								type="number"
								placeholder="Ex: 18"
								min="0"
								max="120"
								value={filtros.idadeMinima || ''}
								onChange={(e) => handleInputChange('idadeMinima', parseInt(e.target.value) || '')}
								style={estiloInput}
							/>
						</div>

						{/* Campo Idade Máxima */}
						<div style={estiloCampo}>
							<label style={estiloLabel}>Idade Máxima</label>
							<input
								type="number"
								placeholder="Ex: 65"
								min="0"
								max="120"
								value={filtros.idadeMaxima || ''}
								onChange={(e) => handleInputChange('idadeMaxima', parseInt(e.target.value) || '')}
								style={estiloInput}
							/>
						</div>
					</div>

					{/* Botões */}
					<div style={estiloBotoes}>
						<button
							type="submit"
							disabled={carregandoBusca}
							style={estiloBotaoPrimario}
						>
							{carregandoBusca ? '🔍 Buscando...' : '🔍 Buscar'}
						</button>
						
						<button
							type="button"
							onClick={handleLimpar}
							style={estiloBotaoSecundario}
						>
							🗑️ Limpar
						</button>
					</div>
				</form>
			</div>

			{/* Resultados */}
			{buscaAtiva && (
				<div style={estiloResultados}>
					{carregandoBusca && (
						<div style={estiloCarregando}>
							<p>🔍 Buscando pessoas...</p>
						</div>
					)}

					{erroBusca && (
						<div style={estiloErro}>
							<p>❌ Erro na busca: {(erroBusca as Error).message}</p>
						</div>
					)}

					{!carregandoBusca && !erroBusca && resultadosBusca && (
						<>
							<h3 style={estiloTituloResultados}>
								📋 {resultadosBusca.length} pessoa(s) encontrada(s)
							</h3>
							
							{resultadosBusca.length > 0 ? (
								<div style={estiloGridResultados}>
									{resultadosBusca.map((pessoa: Pessoa) => (
										<CardPessoa key={pessoa.id} {...pessoa} />
									))}
								</div>
							) : (
								<div style={estiloSemResultados}>
									<p>😔 Nenhuma pessoa encontrada com esses critérios.</p>
									<p>Tente ajustar os filtros de busca.</p>
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}

// Estilos
const estiloContainer: React.CSSProperties = {
	marginBottom: '32px'
};

const estiloFormulario: React.CSSProperties = {
	backgroundColor: '#ffffff',
	borderRadius: '12px',
	padding: '24px',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#e5e7eb',
	boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
};

const estiloTitulo: React.CSSProperties = {
	margin: '0 0 20px 0',
	fontSize: '20px',
	fontWeight: '600',
	color: '#1f2937'
};

const estiloForm: React.CSSProperties = {
	width: '100%'
};

const estiloGrid: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
	gap: '16px',
	marginBottom: '20px'
};

const estiloCampo: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '6px'
};

const estiloLabel: React.CSSProperties = {
	fontSize: '14px',
	fontWeight: '500',
	color: '#374151'
};

const estiloInput: React.CSSProperties = {
	padding: '8px 12px',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#d1d5db',
	borderRadius: '6px',
	fontSize: '14px',
	outline: 'none',
	transition: 'border-color 0.2s'
};

const estiloBotoes: React.CSSProperties = {
	display: 'flex',
	gap: '12px',
	justifyContent: 'flex-start'
};

const estiloBotaoPrimario: React.CSSProperties = {
	padding: '10px 20px',
	backgroundColor: '#dc2626',
	color: '#ffffff',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#dc2626',
	borderRadius: '6px',
	fontSize: '14px',
	fontWeight: '500',
	cursor: 'pointer',
	transition: 'background-color 0.2s'
};

const estiloBotaoSecundario: React.CSSProperties = {
	padding: '10px 20px',
	backgroundColor: '#ffffff',
	color: '#374151',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#d1d5db',
	borderRadius: '6px',
	fontSize: '14px',
	fontWeight: '500',
	cursor: 'pointer',
	transition: 'background-color 0.2s'
};

const estiloResultados: React.CSSProperties = {
	marginTop: '24px'
};

const estiloCarregando: React.CSSProperties = {
	textAlign: 'center',
	padding: '20px',
	color: '#6b7280'
};

const estiloErro: React.CSSProperties = {
	textAlign: 'center',
	padding: '20px',
	color: '#ef4444',
	backgroundColor: '#fef2f2',
	borderRadius: '8px'
};

const estiloTituloResultados: React.CSSProperties = {
	margin: '0 0 16px 0',
	fontSize: '18px',
	fontWeight: '600',
	color: '#1f2937'
};

const estiloGridResultados: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
	gap: '16px'
};

const estiloSemResultados: React.CSSProperties = {
	textAlign: 'center',
	padding: '40px 20px',
	backgroundColor: '#f9fafb',
	borderRadius: '8px',
	color: '#6b7280'
};
