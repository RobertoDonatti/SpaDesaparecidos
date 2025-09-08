import { usePaginacaoDinamica } from "../hooks/usePaginacaoDinamica";
import { ControlesPaginacao } from "../components/ControlesPaginacao";
import { FormularioBuscaSimples } from "../components/FormularioBuscaSimples";
import { FiltrosStatus } from "../components/FiltrosStatus";
import CardPessoa from "../components/CardPessoa";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { limparCacheGlobal, verificarStatusCache, buscarPessoasPorFiltro } from "../api";
import { useQuery } from '@tanstack/react-query';
import { buscarEstatisticas } from '../api';
import type { Pessoa, FiltroBusca } from "../types";
import { useState } from "react";
import { devLog, devError } from "../../../utils/devLogger";

function Home() {
    const [modoBusca, setModoBusca] = useState(false);
    const [filtrosBusca, setFiltrosBusca] = useState<FiltroBusca | null>(null);

    const {
        // Dados
        pessoas,
        
        // Informações de paginação
        paginaAtual,
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

    // Query para busca personalizada
    const { 
        data: resultadosBusca, 
        isLoading: carregandoBusca, 
        error: erroBusca 
    } = useQuery({
        queryKey: ['busca-pessoas', filtrosBusca],
        queryFn: () => buscarPessoasPorFiltro(filtrosBusca!),
        enabled: modoBusca && !!filtrosBusca,
        staleTime: 1000 * 60 * 2
    });

    const handleBuscar = (filtros: FiltroBusca) => {
        setFiltrosBusca(filtros);
        setModoBusca(true);
    };

    const voltarParaListagem = () => {
        setModoBusca(false);
        setFiltrosBusca(null);
    };

    // EXPOR FUNÇÕES DE DEBUG NO CONSOLE (apenas em desenvolvimento)
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
        (window as any).limparCache = limparCacheGlobal;
        (window as any).verificarCache = verificarStatusCache;
        (window as any).forcarAtualizacao = () => {
            limparCacheGlobal();
            recarregarDados();
            devLog('🔄 Cache limpo e dados recarregados!');
        };

        // Log para depuração (apenas em desenvolvimento)
        devLog('Home - Estado atual:', {
            carregandoDados,
            erroCarregamento: erroCarregamento?.message,
            totalPessoas: pessoas.length,
            paginaAtual,
            totalPaginas,
            totalRegistros,
            temControles: totalRegistros > 0,
            modoBusca,
            filtrosBusca
        });

        // Log adicional para debug
        if (pessoas.length > 0) {
            devLog('Dados da paginação:', {
                'Pessoas recebidas': pessoas.length,
                'Página atual': paginaAtual,
                'Total de páginas': totalPaginas,
                'Total de registros': totalRegistros,
                'Deveria mostrar paginação': totalRegistros > 0
            });
        }
    }

    // Estados de carregamento e erro
    if (carregandoDados) {
        return <LoadingSkeleton />;
    }
    
    if (erroCarregamento) {
        // Log de erro apenas em desenvolvimento
        devError('Erro detalhado:', erroCarregamento);
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
                     Tentar novamente
                </button>
                <div style={{ marginTop: 16, fontSize: '14px', color: '#6b7280' }}>
                    <p>Verifique sua conexão com a internet e tente novamente.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section responsivo */}
            <div style={{
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                marginBottom: '40px',
                padding: '40px 20px'
            }}>
                <div 
                    className="hero-container"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '40px',
                        maxWidth: '1200px',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                >
                    {/* Formulário de Busca */}
                    <div 
                        className="hero-busca"
                        style={{
                            width: '100%',
                            maxWidth: '600px'
                        }}
                    >
                        <FormularioBuscaSimples onBuscar={handleBuscar} />
                    </div>

                    {/* Estatísticas */}
                    <div 
                        className="hero-estatisticas"
                        style={{
                            display: 'flex',
                            gap: '40px',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{
                            textAlign: 'center',
                            minWidth: '150px'
                        }}>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: '500',
                                letterSpacing: '1px',
                                marginBottom: '8px',
                                color: '#6b7280'
                            }}>
                                PESSOAS LOCALIZADAS
                            </div>
                            <div style={{
                                fontSize: '36px',
                                fontWeight: '700',
                                lineHeight: '1',
                                color: '#16a34a'
                            }}>
                                {estatisticas?.quantPessoasEncontradas || 0}
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            minWidth: '150px'
                        }}>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: '500',
                                letterSpacing: '1px',
                                marginBottom: '8px',
                                color: '#6b7280'
                            }}>
                                PESSOAS DESAPARECIDAS
                            </div>
                            <div style={{
                                fontSize: '36px',
                                fontWeight: '700',
                                lineHeight: '1',
                                color: '#dc2626'
                            }}>
                                {estatisticas?.quantPessoasDesaparecidas || 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div style={{ padding: '0 20px' }}>
                {modoBusca ? (
                    /* Resultados da Busca */
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: 20 
                        }}>
                            <h2 style={{ 
                                fontSize: 24, 
                                fontWeight: 600,
                                margin: 0
                            }}>
                                📋 Resultados da Busca
                            </h2>
                            <button
                                onClick={voltarParaListagem}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                ← Voltar à listagem
                            </button>
                        </div>

                        {carregandoBusca ? (
                            <LoadingSkeleton />
                        ) : erroBusca ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 20px',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                color: '#dc2626'
                            }}>
                                <h3>Erro na busca</h3>
                                <p>{(erroBusca as Error).message}</p>
                            </div>
                        ) : resultadosBusca && resultadosBusca.length > 0 ? (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))',
                                gap: 16, 
                                maxWidth: 1360,
                                margin: '0 auto',
                                justifyContent: 'center'
                            }}>
                                {resultadosBusca.map((pessoa: Pessoa) => (
                                    <CardPessoa key={pessoa.id} {...pessoa} />
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#6b7280',
                                backgroundColor: '#f9fafb',
                                border: '1px dashed #e5e7eb',
                                borderRadius: '12px',
                                margin: '0 auto',
                                maxWidth: '600px'
                            }}>
                                <h3 style={{ marginBottom: '12px', fontSize: '20px', fontWeight: '600' }}>
                                    Nenhuma pessoa encontrada
                                </h3>
                                <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                    Nenhuma pessoa corresponde aos critérios de busca informados.
                                    Tente ajustar os filtros e buscar novamente.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Listagem Normal */
                    <>
                        {/* Filtros de Status */}
                        <FiltrosStatus 
                            statusAtivo={statusAtivo as 'DESAPARECIDO' | 'LOCALIZADO'}
                            aoAlterarStatus={alterarStatus}
                        />
                    
                        {/* Lista de Pessoas */}
                        <div style={{ marginBottom: 20 }}>
                            <h2 style={{ 
                                textAlign: 'center', 
                                marginBottom: 20, 
                                fontSize: 24, 
                                fontWeight: 600 
                            }}>
                                {statusAtivo === 'DESAPARECIDO' ? 'Pessoas Desaparecidas' : 'Pessoas Localizadas'}
                            </h2>
                        </div>

                        {/* Grid de pessoas - responsivo */}
                        {pessoas.length > 0 ? (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))',
                                gap: 16, 
                                maxWidth: 1360,
                                margin: '0 auto',
                                justifyContent: 'center'
                            }}>
                                {pessoas.map((pessoa: Pessoa) => (
                                    <CardPessoa key={pessoa.id} {...pessoa} />
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#6b7280',
                                backgroundColor: '#f9fafb',
                                border: '1px dashed #e5e7eb',
                                borderRadius: '12px',
                                margin: '0 auto',
                                maxWidth: '600px'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                                    {statusAtivo === 'DESAPARECIDO' }
                                </div>
                                <h3 style={{ marginBottom: '12px', fontSize: '20px', fontWeight: '600' }}>
                                    {statusAtivo === 'DESAPARECIDO' 
                                        ? 'Nenhuma pessoa desaparecida encontrada'
                                        : 'Nenhuma pessoa localizada encontrada'
                                    }
                                </h3>
                                <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                    {statusAtivo === 'DESAPARECIDO' 
                                        ? 'Não há registros de pessoas desaparecidas no momento. Isso é uma boa notícia!'
                                        : 'Não há registros de pessoas localizadas para exibir no momento.'
                                    }
                                </p>
                            </div>
                        )}

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
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;