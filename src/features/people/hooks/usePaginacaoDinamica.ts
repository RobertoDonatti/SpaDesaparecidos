import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { listarPessoasPaginadas } from '../api';

export function usePaginacaoDinamica() {
	const [parametrosUrl, definirParametrosUrl] = useSearchParams();
	
	const paginaAtual = parseInt(parametrosUrl.get('pagina') || '1', 10);
	const statusFiltro = parametrosUrl.get('status') as 'DESAPARECIDO' | 'LOCALIZADO' | null;
	const statusPadrao = statusFiltro || 'DESAPARECIDO'; // Padrão: mostrar apenas desaparecidos
	const registrosPorPagina = 12; // Grid padronizado 3 linhas x 4 colunas
	
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
		staleTime: 1000 * 60 * 5, // 5 minutos - dados considerados frescos por mais tempo
		gcTime: 1000 * 60 * 10, // 10 minutos no cache
		enabled: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false // Não recarregar para manter consistência
	});
	
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
	const alterarStatus = (novoStatus: 'DESAPARECIDO' | 'LOCALIZADO') => {
		const novosParametros = new URLSearchParams(parametrosUrl);
		novosParametros.set('status', novoStatus);
		
		novosParametros.set('pagina', '1');
		definirParametrosUrl(novosParametros);
	};

	const temPaginaAnterior = paginaAtual > 1;
	const temProximaPagina = respostaPaginacao ? paginaAtual < respostaPaginacao.totalPaginas : false;
	
	return {
		pessoas: respostaPaginacao?.pessoas || [],
		
		paginaAtual,
		registrosPorPagina,
		totalRegistros: respostaPaginacao?.totalRegistros || 0,
		totalPaginas: respostaPaginacao?.totalPaginas || 0,
		
		statusAtivo: statusPadrao as 'DESAPARECIDO' | 'LOCALIZADO',
		
		carregandoDados,
		erroCarregamento,
		
		irParaPagina,
		irParaPaginaAnterior,
		irParaProximaPagina,
		irParaPrimeiraPagina,
		irParaUltimaPagina,
		
		alterarStatus,
		
		temPaginaAnterior,
		temProximaPagina,
		
		recarregarDados
	};
}
