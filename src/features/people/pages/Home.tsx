import { usePaginacaoDinamica } from "../hooks/usePaginacaoDinamica";
import { ControlesPaginacao } from "../components/ControlesPaginacao";
import { DashboardEstatisticas } from "../components/DashboardEstatisticas";
import { FormularioBusca } from "../components/FormularioBusca";
import { FiltrosStatus } from "../components/FiltrosStatus";
import CardPessoa from "../components/CardPessoa";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { limparCacheGlobal, verificarStatusCache } from "../api";
import { useQuery } from '@tanstack/react-query';
import { buscarEstatisticas } from '../api';
import type { Pessoa } from "../types";

function Home() {
    const {
        // Dados
        pessoas,
        
        // Informações de paginação
        paginaAtual,
        registrosPorPagina,
        totalRegistros,
        totalPaginas,
        
        // Status atual
        statusAtivo,
        
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
    } = usePaginacaoDinamica();

    // Buscar estatísticas para os filtros
    const { data: estatisticas } = useQuery({
        queryKey: ['estatisticas'],
        queryFn: buscarEstatisticas,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    // EXPOR FUNÇÕES DE DEBUG NO CONSOLE (apenas em desenvolvimento)
    if (typeof window !== 'undefined') {
        (window as any).limparCache = limparCacheGlobal;
        (window as any).verificarCache = verificarStatusCache;
        (window as any).forcarAtualizacao = () => {
            limparCacheGlobal();
            recarregarDados();
            console.log('🔄 Cache limpo e dados recarregados!');
        };
    }

    // Log para depuração
    console.log('🏠 Home - Estado atual:', {
        carregandoDados,
        erroCarregamento: erroCarregamento?.message,
        totalPessoas: pessoas.length,
        paginaAtual,
        totalPaginas,
        totalRegistros,
        temControles: totalRegistros > 0
    });

    // Log adicional para debug
    if (pessoas.length > 0) {
        console.log('📊 Dados da paginação:', {
            'Pessoas recebidas': pessoas.length,
            'Página atual': paginaAtual,
            'Total de páginas': totalPaginas,
            'Total de registros': totalRegistros,
            'Deveria mostrar paginação': totalRegistros > 0
        });
    }

    // Estados de carregamento e erro
    if (carregandoDados) {
        return <LoadingSkeleton />;
    }
    
    if (erroCarregamento) {
        console.error('Erro detalhado:', erroCarregamento);
        return (
            <div style={{ 
                padding: 20, 
                textAlign: 'center',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                margin: '20px'
            }}>
                <h3 style={{ color: '#dc2626', marginBottom: 16 }}>
                    Erro ao carregar dados
                </h3>
                <p style={{ color: '#7f1d1d', marginBottom: 16 }}>
                    {(erroCarregamento as Error).message || 'Erro desconhecido'}
                </p>
                <button 
                    onClick={() => recarregarDados()}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}
                >
                    🔄 Tentar novamente
                </button>
                <div style={{ marginTop: 16, fontSize: '14px', color: '#6b7280' }}>
                    <p>Verifique sua conexão com a internet e tente novamente.</p>
                </div>
            </div>
        );
    }

    // Calcular intervalo de registros exibidos
    const registroInicial = (paginaAtual - 1) * registrosPorPagina + 1;
    const registroFinal = Math.min(paginaAtual * registrosPorPagina, totalRegistros);

    return (
        <div style={{ padding: 20 }}>
            {/* Dashboard de Estatísticas */}
            <DashboardEstatisticas />
            
            {/* Filtros de Status */}
            <FiltrosStatus 
                statusAtivo={statusAtivo as 'DESAPARECIDO' | 'LOCALIZADO'}
                aoAlterarStatus={alterarStatus}
                quantidadeDesaparecidos={estatisticas?.quantPessoasDesaparecidas || 0}
                quantidadeLocalizados={estatisticas?.quantPessoasEncontradas || 0}
            />
            
            {/* Formulário de Busca */}
            <FormularioBusca />

            {/* Cabeçalho com informações */}
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ 
                    textAlign: 'center', 
                    marginBottom: 20, 
                    fontSize: 24, 
                    fontWeight: 600 
                }}>
                    {statusAtivo === 'DESAPARECIDO' ? 'Pessoas Desaparecidas' : 'Pessoas Localizadas'}
                </h2>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Exibindo {pessoas.length} registros ({registroInicial}-{registroFinal} de {totalRegistros})
                    </p>
                </div>
            </div>

            {/* Grid de pessoas - 3 linhas x 4 colunas = 12 registros */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', // 4 colunas
                gridTemplateRows: 'repeat(3, 1fr)',    // 3 linhas
                gap: 16, 
                maxWidth: 1200, 
                margin: '0 auto',
                minHeight: '450px' // Altura ajustada para 3 linhas
            }}>
                {pessoas.map((pessoa: Pessoa) => (
                    <CardPessoa key={pessoa.id} {...pessoa} />
                ))}
                
                {/* Placeholders para manter o grid consistente se houver menos de 12 registros */}
                {Array.from({ length: Math.max(0, 12 - pessoas.length) }).map((_, index) => (
                    <div 
                        key={`placeholder-${index}`}
                        style={{
                            backgroundColor: '#f9fafb',
                            border: '2px dashed #e5e7eb',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9ca3af',
                            fontSize: '14px'
                        }}
                    >
                        Aguardando dados...
                    </div>
                ))}
            </div>

            {/* Controles de paginação */}
            {totalRegistros > 0 ? (
                <ControlesPaginacao
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    totalRegistros={totalRegistros}
                    irParaPagina={irParaPagina}
                    irParaPaginaAnterior={irParaPaginaAnterior}
                    irParaProximaPagina={irParaProximaPagina}
                    irParaPrimeiraPagina={irParaPrimeiraPagina}
                    irParaUltimaPagina={irParaUltimaPagina}
                    temPaginaAnterior={temPaginaAnterior}
                    temProximaPagina={temProximaPagina}
                />
            ) : (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                    border: '1px dashed #e5e7eb',
                    borderRadius: '8px',
                    margin: '20px 0'
                }}>
                    🔍 Debug: Total de registros = {totalRegistros} | Total de páginas = {totalPaginas}
                    <br />
                    {pessoas.length > 0 ? 
                        `Mostrando ${pessoas.length} pessoas mas sem paginação` : 
                        'Nenhuma pessoa carregada'
                    }
                </div>
            )}
        </div>
    );
}

export default Home;