import { Link } from "react-router-dom";
import { formatDateBR } from "../../../utils/date";
import type { Pessoa } from "../types";

export default function CardPessoa(pessoa: Pessoa) {
	const fallback = "https://placehold.co/640x480?text=Sem+foto";
	
	// Extrair informações do objeto
	const sexoFormatado = pessoa.sexo === "MASCULINO" ? "Masculino" : "Feminino";
	const idadeSexo = `${pessoa.idade} anos, ${sexoFormatado}`;
	
	// Extrair cidade e estado do localDesaparecimentoConcat
	const localParts = pessoa.ultimaOcorrencia.localDesaparecimentoConcat.split(' - ');
	const local = localParts.length > 1 ? localParts[1] : pessoa.ultimaOcorrencia.localDesaparecimentoConcat;
	
	// Satus atualizado para considerar o sexo do indivíduo
	const status = pessoa.ultimaOcorrencia.dataLocalizacao 
		? (pessoa.sexo === "MASCULINO" ? "Localizado" : "Localizada")
		: (pessoa.sexo === "MASCULINO" ? "Desaparecido" : "Desaparecida");
	const statusColor = pessoa.ultimaOcorrencia.dataLocalizacao ? "#22c55e" : "#ef4444";
	
	// Data de desaparecimento
	const dataDesaparecimento = pessoa.ultimaOcorrencia.dtDesaparecimento;

	return (
		<Link to={`/p/${pessoa.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
			<div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #0001', background: '#fff', margin: 8 }}>
				<div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#f3f4f6' }}>
					<img
						src={pessoa.urlFoto || fallback}
						onError={(e)=>((e.currentTarget as HTMLImageElement).src=fallback)}
						alt={`Foto de ${pessoa.nome}`}
						loading="lazy"
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
					<span style={{ position: 'absolute', top: 8, right: 8, background: statusColor, color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
						{status}
					</span>
				</div>
				<div style={{ padding: 16 }}>
					<h3 style={{ fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, fontSize: 14 }}>{pessoa.nome}</h3>
					<p style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{idadeSexo}</p>
					<div style={{ fontSize: 14 }}>
						<p><span style={{ fontWeight: 500 }}>Data:</span> {formatDateBR(dataDesaparecimento)}</p>
						<p><span style={{ fontWeight: 500 }}>Local:</span> {local || "—"}</p>
					</div>
				</div>
			</div>
		</Link>
	);
}