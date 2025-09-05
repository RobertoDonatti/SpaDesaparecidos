import { Link } from "react-router-dom";
import { formatDateBR } from "../../../utils/date";
import type { Pessoa } from "../types";

export default function CardPessoa(p: Pessoa) {
	const fallback = "https://placehold.co/640x480?text=Sem+foto";
	
	// Extrair informações do objeto
	const sexoFormatado = p.sexo === "MASCULINO" ? "Masculino" : "Feminino";
	const idadeSexo = `${p.idade} anos, ${sexoFormatado}`;
	
	// Extrair cidade e estado do localDesaparecimentoConcat
	const localParts = p.ultimaOcorrencia.localDesaparecimentoConcat.split(' - ');
	const local = localParts.length > 1 ? localParts[1] : p.ultimaOcorrencia.localDesaparecimentoConcat;
	
	// Status baseado em se foi encontrado vivo
	const status = p.ultimaOcorrencia.dataLocalizacao ? "Localizada" : "Desaparecido";
	const statusColor = status === "Localizada" ? "#22c55e" : "#ef4444";
	
	// Data de desaparecimento
	const dataDesaparecimento = p.ultimaOcorrencia.dtDesaparecimento;

	return (
		<Link to={`/p/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
			<div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #0001', background: '#fff', margin: 8 }}>
				<div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#f3f4f6' }}>
					<img
						src={p.urlFoto || fallback}
						onError={(e)=>((e.currentTarget as HTMLImageElement).src=fallback)}
						alt={`Foto de ${p.nome}`}
						loading="lazy"
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
					<span style={{ position: 'absolute', top: 8, right: 8, background: statusColor, color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
						{status}
					</span>
				</div>
				<div style={{ padding: 16 }}>
					<h3 style={{ fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, fontSize: 14 }}>{p.nome}</h3>
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