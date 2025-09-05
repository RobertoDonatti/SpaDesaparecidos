import { api } from '../../lib/axios'
import type { FiltroPessoa, Pessoa } from './types'

export async function listPeople(filters: FiltroPessoa): Promise<Pessoa[]> {
	try {
		const url = `https://abitus-api.geia.vip/v1/pessoas/aberto/dinamico?registros=${filters.registros || 12}`;
		
		console.log('� Fazendo fetch direto para:', url);
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'accept': '*/*'
			}
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		console.log('✅ Dados recebidos:', data);
		
		return data;
	} catch (error) {
		console.error('❌ Erro na requisição:', error);
		throw error;
	}
}

export async function getPerson(id: string): Promise<Pessoa> {
	try {
		const url = `https://abitus-api.geia.vip/v1/pessoas/${id}`;
		
		console.log('🚀 Fazendo fetch para pessoa:', url);
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'accept': 'application/json'
			}
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		console.log('✅ Dados da pessoa recebidos:', data);
		
		return data;
	} catch (error) {
		console.error('❌ Erro na requisição da pessoa:', error);
		throw error;
	}
}

// Envia informações adicionais sobre uma pessoa
export async function enviarInformacoes(id: string, payload: {
	observacao: string;
	telefone?: string;
	dataHora?: string;
	latitude?: number;
	longitude?: number;
	fotos?: File[];
}) {
	const form = new FormData();
	form.append('observacao', payload.observacao);
	if (payload.telefone) form.append('telefone', payload.telefone);
	if (payload.dataHora) form.append('dataHora', payload.dataHora);
	if (payload.latitude != null) form.append('latitude', String(payload.latitude));
	if (payload.longitude != null) form.append('longitude', String(payload.longitude));
	(payload.fotos || []).forEach((f) => form.append('fotos', f));

	const { data } = await api.post(`/pessoas/${id}/informacoes`, form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return data;
}