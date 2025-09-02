import { api } from '../../lib/axios'
import type { PageResponse, FiltroPessoa, Pessoa } from './types'


export async function listPeople(filters: FiltroPessoa) {
	const params = {
		q: filters.q || undefined,
		sexo: filters.sexo || undefined,
		cidade: filters.cidade || undefined,
		page: filters.page ?? 1,
		size: filters.size ?? 12,
	};
	const { data } = await api.get<PageResponse<Pessoa>>('/pessoas', { params });
	return data;
}


export async function getPerson(id: string) {
	const { data } = await api.get<Pessoa>(`/pessoas/${id}`);
	return data;
}

// Envia informações adicionais sobre uma pessoa
export async function submitReport(id: string, payload: {
	observacao: string;
	telefone?: string;
	dataHora?: string;
	lat?: number;
	lng?: number;
	fotos?: File[];
}) {
	const form = new FormData();
	form.append('observacao', payload.observacao);
	if (payload.telefone) form.append('telefone', payload.telefone);
	if (payload.dataHora) form.append('dataHora', payload.dataHora);
	if (payload.lat != null) form.append('lat', String(payload.lat));
	if (payload.lng != null) form.append('lng', String(payload.lng));
	(payload.fotos || []).forEach((f) => form.append('fotos', f));

	const { data } = await api.post(`/pessoas/${id}/informacoes`, form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return data;
}