import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPerson } from '../api'
import Loading from '../../../components/Loading'
import EmptyState from '../../../components/EmptyState'
import { useState } from 'react'
import EnviarInformacaoForm from '../components/EnviarInformacaoForm'
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
	const localParts = data.ultimaOcorrencia.localDesaparecimentoConcat.split(' - ');
	const local = localParts.length > 1 ? localParts[1] : data.ultimaOcorrencia.localDesaparecimentoConcat;
	const status = data.ultimaOcorrencia.dataLocalizacao ? "LOCALIZADA" : "DESAPARECIDA";
	const statusColor = status === "LOCALIZADA" ? "#22c55e" : "#ef4444";
	const diasDesaparecida = sinceBR(data.ultimaOcorrencia.dtDesaparecimento);
	
	return (
		<div style={{ 
			maxWidth: 1200, 
			margin: '0 auto', 
			padding: 20,
			display: 'flex',
			gap: 40,
			alignItems: 'flex-start'
		}}>
			{/* Coluna da Foto */}
			<div style={{ 
				flex: '0 0 400px',
				border: '3px solid #ef4444',
				borderRadius: 12,
				overflow: 'hidden',
				background: '#fff'
			}}>
				<img 
					src={data.urlFoto} 
					alt={data.nome}
					style={{ 
						width: '100%', 
						height: '500px', 
						objectFit: 'cover',
						display: 'block'
					}}
					onError={(e) => {
						(e.currentTarget as HTMLImageElement).src = "https://placehold.co/400x500?text=Sem+foto"
					}}
				/>
			</div>

			{/* Coluna das Informações */}
			<div style={{ flex: 1 }}>
				{/* Status Badge */}
				<div style={{ 
					background: statusColor, 
					color: 'white', 
					padding: '8px 16px',
					borderRadius: 6,
					fontWeight: 'bold',
					fontSize: 14,
					display: 'inline-block',
					marginBottom: 16
				}}>
					{status}
				</div>

				{/* Nome */}
				<h1 style={{ 
					fontSize: 32, 
					fontWeight: 'bold', 
					textTransform: 'uppercase',
					margin: '0 0 8px 0',
					color: '#1f2937'
				}}>
					{data.nome}
				</h1>

				{/* Idade e Sexo */}
				<p style={{ 
					fontSize: 18, 
					color: '#6b7280', 
					margin: '0 0 32px 0' 
				}}>
					{data.idade} anos - {sexoFormatado}
				</p>

				{/* Dados sobre o Desaparecimento */}
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

				{/* Alerta de Tempo */}
				<div style={{ 
					background: '#fef2f2', 
					border: '1px solid #fecaca',
					borderRadius: 8,
					padding: 16,
					marginBottom: 32
				}}>
					<p style={{ 
						color: '#dc2626', 
						fontWeight: 'bold',
						fontSize: 18,
						margin: 0
					}}>
						DESAPARECIDA HÁ {diasDesaparecida.toUpperCase()}!
					</p>
				</div>

				{/* Botão de Informação */}
				<button 
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
					<span>📍</span>
					VIU OU SABE DESSA PESSOA?
				</button>

				{/* Compartilhamento */}
				<div>
					<h3 style={{ 
						fontSize: 18, 
						fontWeight: 'bold', 
						marginBottom: 16,
						color: '#1f2937'
					}}>
						Ajude compartilhando:
					</h3>
					
					<div style={{ display: 'flex', gap: 12 }}>
						<button style={{ 
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
						}}>
							📱 COMPARTILHE PELO WHATSAPP
						</button>
						
						<button style={{ 
							background: '#e1306c', 
							color: 'white',
							border: 'none',
							borderRadius: 6,
							padding: '8px 16px',
							fontSize: 14,
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: 8
						}}>
							📸 BAIXE O CARTAZ PARA INSTAGRAM
						</button>
					</div>
				</div>

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

				{/* Formulário de Informação */}
				{showForm && (
					<div style={{ 
						marginTop: 32,
						padding: 24,
						background: '#f9fafb',
						borderRadius: 8,
						border: '1px solid #e5e7eb'
					}}>
						<EnviarInformacaoForm personId={id!} onSubmitted={() => setShowForm(false)} />
					</div>
				)}
			</div>
		</div>
	)
}

export default DetalhesPessoa