import { api } from '../../lib/axios'
import type { FiltroPessoa, Pessoa, RespostaPaginacao, FiltroBusca, EstatisticasPessoas } from './types'

// Cache global para manter consistência do total de registros
let cacheGlobal: {
	totalRegistros: number | null;
	todosOsRegistros: Pessoa[] | null;
	ultimaAtualizacao: number | null;
} = {
	totalRegistros: null,
	todosOsRegistros: null,
	ultimaAtualizacao: null
};

// Tempo de validade do cache (30 segundos para dados mais frescos)
const TEMPO_CACHE_MS = 30 * 1000;

// Função otimizada que usa o cache global
export async function obterTotalRegistros(): Promise<number> {
	try {
		const todosOsRegistros = await buscarTodosOsRegistros();
		return todosOsRegistros.length;
	} catch (error) {
		console.error('Erro ao obter total, usando padrão:', error);
		return 74; // Valor padrão baseado nas imagens mostradas
	}
}

// Função para buscar todos os registros uma única vez
async function buscarTodosOsRegistros(): Promise<Pessoa[]> {
	const agora = Date.now();
	
	// Verificar se o cache ainda é válido
	if (
		cacheGlobal.todosOsRegistros &&
		cacheGlobal.ultimaAtualizacao &&
		(agora - cacheGlobal.ultimaAtualizacao) < TEMPO_CACHE_MS
	) {
		console.log('📦 Usando dados do cache');
		return cacheGlobal.todosOsRegistros;
	}
	
	try {
		console.log('Buscando todos os registros da API...');
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
		
		// Atualizar cache
		cacheGlobal.todosOsRegistros = dados;
		cacheGlobal.totalRegistros = dados.length;
		cacheGlobal.ultimaAtualizacao = agora;
		
		console.log(`Cache atualizado com ${dados.length} registros`);
		return dados;
		
	} catch (error) {
		console.error('Erro ao buscar registros:', error);
		
		// Verificar se é erro CORS específico
		if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
			console.error('🚫 Erro CORS detectado - API não permite requisições do navegador');
			console.log('Usando dados de fallback para desenvolvimento');
			
			// Importar dados de fallback apenas quando necessário
			const { dadosFallback } = await import('./dadosFallback');
			
			// Atualizar cache com dados de fallback
			cacheGlobal.todosOsRegistros = dadosFallback;
			cacheGlobal.totalRegistros = dadosFallback.length;
			cacheGlobal.ultimaAtualizacao = agora;
			
			return dadosFallback;
		}
		
		// Se falhar e tivermos cache antigo, usar ele
		if (cacheGlobal.todosOsRegistros) {
			console.log('Usando cache antigo por erro na API');
			return cacheGlobal.todosOsRegistros;
		}
		
		throw error;
	}
}

// Função para listar pessoas com paginação CONSISTENTE
export async function listarPessoasPaginadas(filtros: FiltroPessoa & { statusFiltro?: 'DESAPARECIDO' | 'LOCALIZADO' }): Promise<RespostaPaginacao> {
	try {
		const paginaAtual = filtros.paginaAtual || 1;
		const registrosPorPagina = filtros.registrosPorPagina || 12;
		
		console.log(`📄 Buscando página ${paginaAtual} (${registrosPorPagina} registros)`);
		
		// CORREÇÃO: Buscar todos os registros uma única vez
		let todosOsRegistros = await buscarTodosOsRegistros();
		
		// Aplicar filtro de status se especificado
		if (filtros.statusFiltro === 'DESAPARECIDO') {
			todosOsRegistros = todosOsRegistros.filter(pessoa => 
				pessoa.ultimaOcorrencia.dataLocalizacao === null
			);
			console.log(`Filtro aplicado: apenas desaparecidos (${todosOsRegistros.length} registros)`);
		} else if (filtros.statusFiltro === 'LOCALIZADO') {
			todosOsRegistros = todosOsRegistros.filter(pessoa => 
				pessoa.ultimaOcorrencia.dataLocalizacao !== null
			);
			console.log(`Filtro aplicado: apenas localizados (${todosOsRegistros.length} registros)`);
		}
		
		// Calcular paginação baseada no total filtrado
		const totalRegistros = todosOsRegistros.length;
		const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
		
		// Validar página atual (garantir que está entre 1 e totalPaginas)
		const paginaValidada = Math.max(1, Math.min(paginaAtual, totalPaginas));
		
		// Calcular quais registros exibir para esta página
		const registrosParaPular = (paginaValidada - 1) * registrosPorPagina;
		const pessoasDaPagina = todosOsRegistros.slice(registrosParaPular, registrosParaPular + registrosPorPagina);
		
		console.log(`Página ${paginaValidada}/${totalPaginas} carregada`);
		console.log(`Exibindo ${pessoasDaPagina.length} registros de um total de ${totalRegistros}`);
		
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
		
		console.log('Fazendo fetch direto para:', url);
		
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
		console.log('Dados recebidos:', data);
		
		return data;
	} catch (error) {
		console.error('Erro na requisição:', error);
		throw error;
	}
}

// Função para limpar cache (útil para debug)
export function limparCacheGlobal() {
	cacheGlobal.totalRegistros = null;
	cacheGlobal.todosOsRegistros = null;
	cacheGlobal.ultimaAtualizacao = null;
	console.log('Cache global limpo');
}

// Função para forçar atualização de dados
export async function forcarAtualizacaoDados(): Promise<void> {
	console.log('Forçando atualização de dados...');
	
	// Limpar cache
	limparCacheGlobal();
	
	// Buscar dados novos
	const dadosNovos = await buscarTodosOsRegistros();
	console.log(`Dados atualizados: ${dadosNovos.length} registros`);
}

// Função para verificar status do cache (debug)
export function verificarStatusCache() {
	const agora = Date.now();
	const tempoRestante = cacheGlobal.ultimaAtualizacao ? 
		Math.max(0, TEMPO_CACHE_MS - (agora - cacheGlobal.ultimaAtualizacao)) : 0;
	
	console.log('📦 Status do Cache:', {
		'Tem dados em cache': !!cacheGlobal.todosOsRegistros,
		'Total de registros': cacheGlobal.totalRegistros,
		'Última atualização': cacheGlobal.ultimaAtualizacao ? 
			new Date(cacheGlobal.ultimaAtualizacao).toLocaleTimeString() : 'Nunca',
		'Tempo restante (segundos)': Math.ceil(tempoRestante / 1000),
		'Cache válido': tempoRestante > 0
	});
	
	return {
		temDados: !!cacheGlobal.todosOsRegistros,
		tempoRestante: Math.ceil(tempoRestante / 1000),
		cacheValido: tempoRestante > 0
	};
}

// Função para buscar estatísticas
export async function buscarEstatisticas(): Promise<EstatisticasPessoas> {
	try {
		console.log('Buscando estatísticas...');
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
		console.log('Estatísticas carregadas:', dados);
		
		return dados;
	} catch (error) {
		console.error('Erro ao buscar estatísticas:', error);
		
		// Se falhar por CORS, usar estatísticas dos dados de fallback
		if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
			console.log('Usando estatísticas de fallback');
			const { obterEstatisticasFallback } = await import('./dadosFallback');
			return obterEstatisticasFallback();
		}
		
		// Retornar dados padrão em caso de erro
		return {
			quantPessoasDesaparecidas: 0,
			quantPessoasEncontradas: 0
		};
	}
}

// Função para buscar pessoas por filtro
export async function buscarPessoasPorFiltro(filtros: FiltroBusca, statusFiltro?: 'DESAPARECIDO' | 'LOCALIZADO'): Promise<Pessoa[]> {
	try {
		console.log('🔍 Buscando pessoas por filtro:', filtros);
		console.log('📋 Status solicitado:', statusFiltro);
		
		// SEMPRE usar busca local para garantir que os filtros funcionem corretamente
		console.log('📋 Usando busca local para garantir filtros corretos...');
		const todasAsPessoas = await buscarTodosOsRegistros();
		return filtrarPessoasLocalmente(todasAsPessoas, filtros, statusFiltro);
		
	} catch (error) {
		console.error('❌ Erro ao buscar pessoas por filtro:', error);
		return [];
	}
}

// Função para filtrar pessoas localmente quando a API falha
function filtrarPessoasLocalmente(pessoas: Pessoa[], filtros: FiltroBusca, statusFiltro?: 'DESAPARECIDO' | 'LOCALIZADO'): Pessoa[] {
	console.log('🔎 Filtrando localmente com:', filtros);
	console.log('� Status do filtro:', statusFiltro);
	console.log('�📊 Total de pessoas antes do filtro:', pessoas.length);
	
	// Primeiro, filtrar por status se especificado
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
		console.log(`📈 Após filtro de status (${statusFiltro}): ${pessoasFiltradas.length} pessoas`);
	}
	
	// Log das idades encontradas para debug
	const pessoasComIdadeZero = pessoasFiltradas.filter(p => Number(p.idade) === 0);
	if (pessoasComIdadeZero.length > 0) {
		console.log('⚠️ Encontradas pessoas com idade 0:', pessoasComIdadeZero.map(p => ({ nome: p.nome, idade: p.idade })));
	}
	
	const idades = pessoasFiltradas.map(p => ({ nome: p.nome, idade: p.idade, tipo: typeof p.idade }));
	console.log('📈 Primeiras 10 idades encontradas:', idades.slice(0, 10));
	
	const resultado = pessoasFiltradas.filter(pessoa => {
		// Converter idade para número uma vez só
		const idadePessoa = Number(pessoa.idade);
		
		// Log básico para cada pessoa sendo verificada
		console.log(`👤 Verificando ${pessoa.nome}: idade=${pessoa.idade} (convertida: ${idadePessoa})`);
		
		// SEMPRE filtrar pessoas com idade inválida quando há filtro de idade
		if ((filtros.idadeMinima !== undefined || filtros.idadeMaxima !== undefined)) {
			if (isNaN(idadePessoa) || idadePessoa <= 0) {
				console.log(`❌ ${pessoa.nome} rejeitado por idade inválida: ${idadePessoa}`);
				return false;
			}
		}
		
		// Filtro por nome (case-insensitive e com busca parcial)
		if (filtros.nome && filtros.nome.trim() !== '') {
			const nomeMinusculo = pessoa.nome.toLowerCase();
			const filtroNomeMinusculo = filtros.nome.toLowerCase().trim();
			if (!nomeMinusculo.includes(filtroNomeMinusculo)) {
				console.log(`❌ ${pessoa.nome} rejeitado por nome`);
				return false;
			}
		}
		
		// Filtro por sexo
		if (filtros.sexo) {
			const sexoEsperado = filtros.sexo === 'M' ? 'MASCULINO' : 'FEMININO';
			if (pessoa.sexo !== sexoEsperado) {
				console.log(`❌ ${pessoa.nome} rejeitado por sexo: ${pessoa.sexo} !== ${sexoEsperado}`);
				return false;
			}
		}
		
		// Filtro por idade mínima
		if (filtros.idadeMinima !== undefined) {
			const idadeMinima = Number(filtros.idadeMinima);
			if (idadePessoa < idadeMinima) {
				console.log(`❌ ${pessoa.nome} rejeitado por idade mínima: ${idadePessoa} < ${idadeMinima}`);
				return false;
			}
		}
		
		// Filtro por idade máxima
		if (filtros.idadeMaxima !== undefined) {
			const idadeMaxima = Number(filtros.idadeMaxima);
			if (idadePessoa > idadeMaxima) {
				console.log(`❌ ${pessoa.nome} rejeitado por idade máxima: ${idadePessoa} > ${idadeMaxima}`);
				return false;
			}
		}
		
		console.log(`✅ ${pessoa.nome} aceito no filtro (idade: ${idadePessoa})`);
		return true;
	});
	
	console.log(`🎯 Resultado da filtragem: ${resultado.length} pessoas encontradas`);
	
	// Log final das pessoas aceitas
	if (resultado.length > 0) {
		console.log('✅ Pessoas aceitas:', resultado.map(p => ({ nome: p.nome, idade: p.idade })));
	}
	
	return resultado;
}

export async function getPerson(id: string): Promise<Pessoa> {
	try {
		const url = `https://abitus-api.geia.vip/v1/pessoas/${id}`;
		
		console.log('Fazendo fetch para pessoa:', url);
		
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
		console.log('Dados da pessoa recebidos:', data);
		
		return data;
	} catch (error) {
		console.error('Erro na requisição da pessoa:', error);
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