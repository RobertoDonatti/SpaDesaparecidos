import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { listarPessoasPaginadas } from '../api';

export function usePaginacaoDinamica() {
	const [parametrosUrl, definirParametrosUrl] = useSearchParams();
	
	// Obter página atual e status da URL (padrão: DESAPARECIDO)
	const paginaAtual = parseInt(parametrosUrl.get('pagina') || '1', 10);
	const statusFiltro = parametrosUrl.get('status') as 'DESAPARECIDO' | 'LOCALIZADO' | null;
	const statusPadrao = statusFiltro || 'DESAPARECIDO'; // Padrão: mostrar apenas desaparecidos
	const registrosPorPagina = 12; // Grid padronizado 3 linhas x 4 colunas
	
	// Query para buscar dados paginados - COM CACHE CONSISTENTE E FILTRO DE STATUS
	const {
		data: respostaPaginacao,
		isLoading: carregandoDados,
		error: erroCarregamento,
		refetch: recarregarDados
	} = useQuery({
		queryKey: ['pessoas-paginadas', paginaAtual, statusPadrao], // CORREÇÃO: Incluir status na key
		queryFn: () => listarPessoasPaginadas({ 
			paginaAtual, 
			registrosPorPagina,
			statusFiltro: statusPadrao
		}),
		retry: 1,
		staleTime: 1000 * 30, // 30 segundos - dados mais frescos
		gcTime: 1000 * 60 * 2, // 2 minutos no cache
		enabled: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false // Não recarregar para manter consistência
	});
	
	// Funções de navegação
	const irParaPagina = (numeroPagina: number) => {
		const novosParametros = new URLSearchParams(parametrosUrl);
		novosParametros.set('pagina', numeroPagina.toString());
		definirParametrosUrl(novosParametros);
	};
	
	const irParaPaginaAnterior = () => {
		if (paginaAtual > 1) {
			irParaPagina(paginaAtual - 1);
		}
	};
	
	const irParaProximaPagina = () => {
		if (respostaPaginacao && paginaAtual < respostaPaginacao.totalPaginas) {
			irParaPagina(paginaAtual + 1);
		}
	};
	
	const irParaPrimeiraPagina = () => {
		irParaPagina(1);
	};
	
	const irParaUltimaPagina = () => {
		if (respostaPaginacao) {
			irParaPagina(respostaPaginacao.totalPaginas);
		}
	};
	// Função para alterar status
	const alterarStatus = (novoStatus: 'DESAPARECIDO' | 'LOCALIZADO') => {
		const novosParametros = new URLSearchParams(parametrosUrl);
		novosParametros.set('status', novoStatus);
		
		// Resetar para página 1 ao mudar filtro
		novosParametros.set('pagina', '1');
		definirParametrosUrl(novosParametros);
	};

	// Estados derivados
	const temPaginaAnterior = paginaAtual > 1;
	const temProximaPagina = respostaPaginacao ? paginaAtual < respostaPaginacao.totalPaginas : false;
	
	return {
		// Dados
		pessoas: respostaPaginacao?.pessoas || [],
		
		// Informações de paginação
		paginaAtual,
		registrosPorPagina,
		totalRegistros: respostaPaginacao?.totalRegistros || 0,
		totalPaginas: respostaPaginacao?.totalPaginas || 0,
		
		// Status atual
		statusAtivo: statusPadrao as 'DESAPARECIDO' | 'LOCALIZADO',
		
		// Estados de carregamento
		carregandoDados,
		erroCarregamento,
		
		// Navegação
		irParaPagina,
		irParaPaginaAnterior,
		irParaProximaPagina,
		irParaPrimeiraPagina,
		irParaUltimaPagina,
		
		// Controle de status
		alterarStatus,
		
		// Estados úteis
		temPaginaAnterior,
		temProximaPagina,
		
		// Utilidades
		recarregarDados
	};
}
