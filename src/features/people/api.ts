import { api } from '../../lib/axios'
import type { FiltroPessoa, Pessoa, RespostaPaginacao, FiltroBusca, EstatisticasPessoas } from './types'

const cacheGlobal: {
	totalRegistros: number | null;
	todosOsRegistros: Pessoa[] | null;
	ultimaAtualizacao: number | null;
} = {
	totalRegistros: null,
	todosOsRegistros: null,
	ultimaAtualizacao: null
};

const TEMPO_CACHE_MS = 5 * 60 * 1000;

export function limparCache() {
	cacheGlobal.totalRegistros = null;
	cacheGlobal.todosOsRegistros = null;
	cacheGlobal.ultimaAtualizacao = null;
}

export async function obterTotalRegistros(): Promise<number> {
	try {
		const todosOsRegistros = await buscarTodosOsRegistros();
		return todosOsRegistros.length;
	} catch (error) {
		console.error('Erro ao obter total, usando padrão:', error);
		return 74; // Valor padrão baseado nas imagens mostradas
	}
}

async function buscarTodosOsRegistros(): Promise<Pessoa[]> {
	const agora = Date.now();
	
	if (
		cacheGlobal.todosOsRegistros &&
		cacheGlobal.ultimaAtualizacao &&
		(agora - cacheGlobal.ultimaAtualizacao) < TEMPO_CACHE_MS
	) {
		return cacheGlobal.todosOsRegistros;
	}
	
	try {
		const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/dinamico?registros=200';
		
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
		
		if (!response.ok) {
			throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
		}
		
		const dados = await response.json();
		
		if (!Array.isArray(dados)) {
			throw new Error('API retornou dados em formato inesperado');
		}
		
		cacheGlobal.todosOsRegistros = dados;
		cacheGlobal.totalRegistros = dados.length;
		cacheGlobal.ultimaAtualizacao = agora;
		
		return dados;
		
	} catch (error) {
		console.error('Erro ao buscar registros:', error);
		
		if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
			const { dadosFallback } = await import('./dadosFallback');
			
			cacheGlobal.todosOsRegistros = dadosFallback;
			cacheGlobal.totalRegistros = dadosFallback.length;
			cacheGlobal.ultimaAtualizacao = agora;
			
			return dadosFallback;
		}
		
		if (cacheGlobal.todosOsRegistros) {
			return cacheGlobal.todosOsRegistros;
		}
		
		throw error;
	}
}

export async function listarPessoasPaginadas(filtros: FiltroPessoa & { statusFiltro?: 'DESAPARECIDO' | 'LOCALIZADO' }): Promise<RespostaPaginacao> {
	try {
		const paginaAtual = filtros.paginaAtual || 1;
		const registrosPorPagina = filtros.registrosPorPagina || 12;
		
		let todosOsRegistros = await buscarTodosOsRegistros();
		
		if (filtros.statusFiltro === 'DESAPARECIDO') {
			todosOsRegistros = todosOsRegistros.filter(pessoa => 
				pessoa.ultimaOcorrencia.dataLocalizacao === null
			);
		} else if (filtros.statusFiltro === 'LOCALIZADO') {
			todosOsRegistros = todosOsRegistros.filter(pessoa => 
				pessoa.ultimaOcorrencia.dataLocalizacao !== null
			);
		}
		
		const totalRegistros = todosOsRegistros.length;
		const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
		
		const paginaValidada = Math.max(1, Math.min(paginaAtual, totalPaginas));
		
		const registrosParaPular = (paginaValidada - 1) * registrosPorPagina;
		const pessoasDaPagina = todosOsRegistros.slice(registrosParaPular, registrosParaPular + registrosPorPagina);
		
		return {
			pessoas: pessoasDaPagina,
			paginaAtual: paginaValidada,
			registrosPorPagina,
			totalRegistros,
			totalPaginas
		};
	} catch (error) {
		console.error('Erro na busca paginada:', error);
		throw error;
	}
}

export async function listPeople(filters: FiltroPessoa): Promise<Pessoa[]> {
	try {
		const url = `https://abitus-api.geia.vip/v1/pessoas/aberto/dinamico?registros=${filters.registros || 12}`;
		
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
		
		return data;
	} catch (error) {
		console.error('Erro na requisição:', error);
		throw error;
	}
}

export function limparCacheGlobal() {
	cacheGlobal.totalRegistros = null;
	cacheGlobal.todosOsRegistros = null;
	cacheGlobal.ultimaAtualizacao = null;
}

export async function forcarAtualizacaoDados(): Promise<void> {
	limparCacheGlobal();
	
	await buscarTodosOsRegistros();
}

export async function buscarEstatisticas(): Promise<EstatisticasPessoas> {
	try {
		const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/estatistico';
		
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
		
		if (!response.ok) {
			throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
		}
		
		const dados = await response.json();
		
		return dados;
	} catch (error) {
		console.error('Erro ao buscar estatísticas:', error);
		
		if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
			const { obterEstatisticasFallback } = await import('./dadosFallback');
			return obterEstatisticasFallback();
		}
		
		return {
			quantPessoasDesaparecidas: 0,
			quantPessoasEncontradas: 0
		};
	}
}

export async function buscarPessoasPorFiltro(filtros: FiltroBusca, statusFiltro?: 'DESAPARECIDO' | 'LOCALIZADO'): Promise<Pessoa[]> {
	try {
		const todasAsPessoas = await buscarTodosOsRegistros();
		return filtrarPessoasLocalmente(todasAsPessoas, filtros, statusFiltro);
		
	} catch (error) {
		console.error('Erro ao buscar pessoas por filtro:', error);
		return [];
	}
}

function filtrarPessoasLocalmente(pessoas: Pessoa[], filtros: FiltroBusca, statusFiltro?: 'DESAPARECIDO' | 'LOCALIZADO'): Pessoa[] {
	let pessoasFiltradas = pessoas;
	if (statusFiltro) {
		pessoasFiltradas = pessoas.filter(pessoa => {
			const estaLocalizada = pessoa.ultimaOcorrencia.dataLocalizacao !== null;
			if (statusFiltro === 'LOCALIZADO') {
				return estaLocalizada;
			} else {
				return !estaLocalizada;
			}
		});
	}
	
	const resultado = pessoasFiltradas.filter(pessoa => {
		const idadePessoa = Number(pessoa.idade);
		
		if ((filtros.idadeMinima !== undefined || filtros.idadeMaxima !== undefined)) {
			if (isNaN(idadePessoa) || idadePessoa < 0) {
				return false;
			}
		}
		
		if (filtros.nome && filtros.nome.trim() !== '') {
			const nomeMinusculo = pessoa.nome.toLowerCase();
			const filtroNomeMinusculo = filtros.nome.toLowerCase().trim();
			
			const encontrado = filtroNomeMinusculo.length === 1 
				? nomeMinusculo.startsWith(filtroNomeMinusculo)
				: nomeMinusculo.includes(filtroNomeMinusculo);
				
			if (!encontrado) {
				return false;
			}
		}
		
		if (filtros.sexo) {
			const sexoEsperado = filtros.sexo === 'M' ? 'MASCULINO' : 'FEMININO';
			if (pessoa.sexo !== sexoEsperado) {
				return false;
			}
		}
		
		if (filtros.idadeMinima !== undefined) {
			const idadeMinima = Number(filtros.idadeMinima);
			if (idadePessoa < idadeMinima) {
				return false;
			}
		}
		
		if (filtros.idadeMaxima !== undefined) {
			const idadeMaxima = Number(filtros.idadeMaxima);
			if (idadePessoa > idadeMaxima) {
				return false;
			}
		}
		
		return true;
	});
	
	return resultado;
}

export async function getPerson(id: string): Promise<Pessoa> {
	try {
		const url = `https://abitus-api.geia.vip/v1/pessoas/${id}`;
		
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
		
		return data;
	} catch (error) {
		console.error('Erro na requisição da pessoa:', error);
		throw error;
	}
}

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
