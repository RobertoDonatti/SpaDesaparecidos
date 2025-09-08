import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPerson } from '../api'
import Loading from '../../../components/Loading'
import EmptyState from '../../../components/EmptyState'
import { useState } from 'react'
import FormularioDetalhePessoa from '../components/FormularioDetalhePessoa'
import { formatDateBR, sinceBR } from '../../../utils/date'

function DetalhesPessoa() {
	const [showForm, setShowForm] = useState(false)
	const { id } = useParams<{ id: string }>()
	const { data, isLoading, isError } = useQuery({
		queryKey: ['person', id],
		queryFn: () => getPerson(id!),
		enabled: !!id,
	})

	if (isLoading) return <Loading />
	if (isError || !data) return <EmptyState title="Não encontrado" description="Registro inexistente." />

	// Extrair informações
	const sexoFormatado = data.sexo === "MASCULINO" ? "Masculino" : "Feminino";
	
	// Verificar se a pessoa foi localizada
	const foiLocalizada = !!data.ultimaOcorrencia.dataLocalizacao;
	
	// Status com base no sexo e situação
	const statusTexto = foiLocalizada 
		? (data.sexo === "MASCULINO" ? "LOCALIZADO" : "LOCALIZADA")
		: (data.sexo === "MASCULINO" ? "DESAPARECIDO" : "DESAPARECIDA");
	
	// Cores: verde para localizado, vermelho para desaparecido
	const statusColor = foiLocalizada ? "#22c55e" : "#ef4444";
	
	const tempoDesaparecido = sinceBR(data.ultimaOcorrencia.dtDesaparecimento);
	
	// Texto para tempo desaparecido/localizado com concordância de gênero
	const textoTempo = foiLocalizada
		? (data.sexo === "MASCULINO" 
			? `LOCALIZADO EM ${formatDateBR(data.ultimaOcorrencia.dataLocalizacao!)}`
			: `LOCALIZADA EM ${formatDateBR(data.ultimaOcorrencia.dataLocalizacao!)}`)
		: (data.sexo === "MASCULINO" 
			? `DESAPARECIDO HÁ ${tempoDesaparecido.toUpperCase()}!`
			: `DESAPARECIDA HÁ ${tempoDesaparecido.toUpperCase()}!`);
	
	return (
		<div 
			className="detalhes-container-responsivo"
		>
			{/* Coluna da Foto */}
			<div 
				className="detalhes-foto-responsiva"
				style={{ 
				border: `3px solid ${statusColor}`
			}}>
				<img 
					src={data.urlFoto} 
					alt={data.nome}
					onError={(e) => {
						(e.currentTarget as HTMLImageElement).src = "https://placehold.co/400x500?text=Sem+foto"
					}}
				/>
			</div>

			{/* Coluna das Informações */}
						{/* Coluna das Informações */}
			<div 
				className="detalhes-info-responsiva"
			>
				{/* Status Badge */}
				<div 
					className="detalhes-status-badge"
					style={{ 
					background: statusColor
				}}>
					{statusTexto}
				</div>

				{/* Nome */}
				<h1 
					className="detalhes-titulo-responsivo"
				>
					{data.nome}
				</h1>

				{/* Idade e Sexo */}
				<p 
					className="detalhes-idade-responsiva"
				>
					{data.idade} anos - {sexoFormatado}
				</p>				{/* Dados condicionais baseados no status */}
				{foiLocalizada ? (
					// Seção para pessoas localizadas
					<div style={{ marginBottom: 32 }}>
						<h2 style={{ 
							fontSize: 20, 
							fontWeight: 'bold', 
							marginBottom: 16,
							color: '#1f2937'
						}}>
							Informações sobre a Localização
						</h2>
						
						<div style={{ lineHeight: 1.6, fontSize: 16 }}>
							<p><strong>Data da Localização:</strong> {formatDateBR(data.ultimaOcorrencia.dataLocalizacao!)}</p>
							<p><strong>Status:</strong> Encontrada viva e bem</p>
							<p><strong>Data do Desaparecimento:</strong> {formatDateBR(data.ultimaOcorrencia.dtDesaparecimento)}</p>
							<p><strong>Local do Desaparecimento:</strong> {data.ultimaOcorrencia.localDesaparecimentoConcat}</p>
						</div>
					</div>
				) : (
					// Seção para pessoas desaparecidas
					<div style={{ marginBottom: 32 }}>
						<h2 style={{ 
							fontSize: 20, 
							fontWeight: 'bold', 
							marginBottom: 16,
							color: '#1f2937'
						}}>
							Dados sobre o Desaparecimento
						</h2>
						
						<div style={{ lineHeight: 1.6, fontSize: 16 }}>
							<p><strong>Data:</strong> {formatDateBR(data.ultimaOcorrencia.dtDesaparecimento)}</p>
							<p><strong>Local:</strong> {data.ultimaOcorrencia.localDesaparecimentoConcat}</p>
							{data.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido && (
								<p><strong>Vestimenta:</strong> {data.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}</p>
							)}
							{data.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao && (
								<p><strong>Informações adicionais:</strong> {data.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}</p>
							)}
						</div>
					</div>
				)}

				{/* Alerta de Status */}
				<div 
					className="detalhes-alerta-responsiva"
					style={{ 
					background: foiLocalizada ? '#f0fdf4' : '#fef2f2', 
					border: foiLocalizada ? '1px solid #bbf7d0' : '1px solid #fecaca',
					borderRadius: 8,
					padding: 16,
					marginBottom: 32
				}}>
					<p style={{ 
						color: foiLocalizada ? '#15803d' : '#dc2626', 
						fontWeight: 'bold',
						fontSize: 18,
						margin: 0
					}}>
						{textoTempo}
					</p>
				</div>

				{/* Botões condicionais */}
				{foiLocalizada ? (
					// Seção para pessoas localizadas
					<div style={{ marginBottom: 32 }}>
						<h3 style={{ 
							fontSize: 18, 
							fontWeight: 'bold', 
							marginBottom: 16,
							color: '#1f2937'
						}}>
							Compartilhar a boa notícia
						</h3>
						
						<div 
							className="detalhes-botoes-responsivos"
							style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
							<button 
								onClick={() => {
									const texto = `ÓTIMA NOTÍCIA! ${data.nome} foi ${statusTexto.toLowerCase()} e está bem! Obrigado a todos que ajudaram na divulgação.`;
									const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
									window.open(url, '_blank');
								}}
								style={{ 
									background: '#25d366', 
									color: 'white',
									border: 'none',
									borderRadius: 8,
									padding: '12px 20px',
									fontSize: 14,
									fontWeight: 'bold',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									gap: 8
								}}
							>
								WhatsApp
							</button>
						</div>
					</div>
				) : (
					// Botão de informação para pessoas desaparecidas
					<button 
						className="detalhes-botao-principal-responsivo"
						onClick={() => setShowForm(!showForm)}
						style={{ 
							background: '#ef4444', 
							color: 'white',
							border: 'none',
							borderRadius: 8,
							padding: '12px 24px',
							fontSize: 16,
							fontWeight: 'bold',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 24
						}}
					>
						VIU OU SABE DESSA PESSOA?
					</button>
				)}

				{/* Seção de compartilhamento para pessoas desaparecidas */}
				{!foiLocalizada && (
					<div style={{ marginBottom: 32 }}>
						<h3 style={{ 
							fontSize: 18, 
							fontWeight: 'bold', 
							marginBottom: 16,
							color: '#1f2937'
						}}>
							Ajude compartilhando:
						</h3>
						
						<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
							<button 
								onClick={() => {
									const texto = `PESSOA DESAPARECIDA: ${data.nome}, ${data.idade} anos. Desapareceu em ${data.ultimaOcorrencia.localDesaparecimentoConcat}. Se tiver informações, denuncie!`;
									const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
									window.open(url, '_blank');
								}}
								style={{ 
									background: '#25d366', 
									color: 'white',
									border: 'none',
									borderRadius: 6,
									padding: '8px 16px',
									fontSize: 14,
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									gap: 8
								}}
							>
								COMPARTILHE PELO WHATSAPP
							</button>
						</div>
					</div>
				)}

				{/* Formulário de Informação - apenas para desaparecidos */}
				{showForm && !foiLocalizada && (
					<div style={{ 
						marginTop: 32,
						padding: 24,
						background: '#f9fafb',
						borderRadius: 8,
						border: '1px solid #e5e7eb'
					}}>
						<FormularioDetalhePessoa 
							onSubmit={(data) => {
								console.log('Dados do formulário:', data);
								setShowForm(false);
							}}
							onCancel={() => setShowForm(false)}
						/>
					</div>
				)}

				{/* Voltar */}
				<div style={{ marginTop: 32 }}>
					<Link 
						to="/" 
						style={{ 
							color: '#3b82f6', 
							textDecoration: 'none',
							fontSize: 16,
							fontWeight: 500
						}}
					>
						← Voltar para lista
					</Link>
				</div>
			</div>
		</div>
	)
}

export default DetalhesPessoa