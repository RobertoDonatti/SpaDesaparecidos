import { Link } from "react-router-dom";
import { formatDateBR } from "../../../utils/date";
import type { Pessoa } from "../types";

export default function CardPessoa(p: Pessoa) {
	const fallback = "https://placehold.co/640x480?text=Sem+foto";
	const idadeSexo = [
		p.idade != null ? `${p.idade} anos` : null,
		p.sexo ? (p.sexo === "M" ? "Masculino" : p.sexo === "F" ? "Feminino" : p.sexo) : null,
	].filter(Boolean).join(", ");

	const local = [p.cidade, p.uf].filter(Boolean).join("/");
	// Supondo que status venha como p.status: "Desaparecido" | "Localizada"
	const status = p.status === "Localizada" ? "Localizada" : "Desaparecido";
	const statusColor = status === "Localizada" ? "#22c55e" : "#ef4444";

		return (
			<Link to={`/p/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
			<div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #0001', background: '#fff', margin: 8 }}>
				<div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#f3f4f6' }}>
					<img
						src={p.fotoUrl || fallback}
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
					<h3 style={{ fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.nome}</h3>
					{idadeSexo && <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{idadeSexo}</p>}
					<div style={{ fontSize: 14 }}>
						<p><span style={{ fontWeight: 500 }}>Data:</span> {formatDateBR(p.dataDesaparecimento)}</p>
						<p><span style={{ fontWeight: 500 }}>Local:</span> {local || "—"}</p>
					</div>
				</div>
			</div>
		</Link>
	);
}