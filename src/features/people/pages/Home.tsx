import { usePaginacaoDinamica } from "../hooks/usePaginacaoDinamica";
import { ControlesPaginacao } from "../components/ControlesPaginacao";
import { FormularioBuscaSimples } from "../components/FormularioBuscaSimples";
import { FiltrosStatus } from "../components/FiltrosStatus";
import CardPessoa from "../components/CardPessoa";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import Modal from "../../../components/Modal";
import { buscarPessoasPorFiltro } from "../api";
import { useQuery } from '@tanstack/react-query';
import { buscarEstatisticas } from '../api';
import type { Pessoa, FiltroBusca } from "../types";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Home() {
    const [modoBusca, setModoBusca] = useState(false);
    const [filtrosBusca, setFiltrosBusca] = useState<FiltroBusca | null>(null);
    const [paginaBusca, setPaginaBusca] = useState(1);
    const [modalNenhumResultado, setModalNenhumResultado] = useState(false);
    const location = useLocation();
    
    const registrosPorPaginaBusca = 12; // Mesmo padrão da listagem normal

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const shouldReset = searchParams.get('reset');
        
        if (shouldReset === 'true') {
            setModoBusca(false);
            setFiltrosBusca(null);
            setPaginaBusca(1);
            
            if (location.search.includes('reset=true')) {
                window.history.replaceState({}, '', '/home');
            }
        }
    }, [location]);

    const {
        pessoas,
        
        paginaAtual,
        totalRegistros,
        totalPaginas,
        
        statusAtivo,
        
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
    } = usePaginacaoDinamica();

    const { data: estatisticas } = useQuery({
        queryKey: ['estatisticas'],
        queryFn: buscarEstatisticas,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const { 
        data: dadosBuscaCompletos, 
        isLoading: carregandoBusca, 
        error: erroBusca 
    } = useQuery({
        queryKey: ['busca-pessoas', filtrosBusca, paginaBusca, statusAtivo],
        queryFn: async () => {
            const todoResultados = await buscarPessoasPorFiltro(filtrosBusca!, statusAtivo as 'DESAPARECIDO' | 'LOCALIZADO');
            
            const inicio = (paginaBusca - 1) * registrosPorPaginaBusca;
            const fim = inicio + registrosPorPaginaBusca;
            const resultadosPaginados = todoResultados.slice(inicio, fim);
            
            return {
                resultados: resultadosPaginados,
                total: todoResultados.length,
                totalPaginas: Math.ceil(todoResultados.length / registrosPorPaginaBusca),
                paginaAtual: paginaBusca,
                statusUtilizado: statusAtivo
            };
        },
        enabled: modoBusca && !!filtrosBusca,
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    const resultadosBusca = dadosBuscaCompletos?.resultados || [];
    const totalResultadosBusca = dadosBuscaCompletos?.total || 0;
    const totalPaginasBusca = dadosBuscaCompletos?.totalPaginas || 0;

    useEffect(() => {
        if (modoBusca) {
            setPaginaBusca(1);
        }
    }, [statusAtivo, modoBusca]);

    useEffect(() => {
        if (modoBusca && !carregandoBusca && !erroBusca && dadosBuscaCompletos && dadosBuscaCompletos.total === 0) {
            setModalNenhumResultado(true);
        }
    }, [modoBusca, carregandoBusca, erroBusca, dadosBuscaCompletos]);

    const handleBuscar = (filtros: FiltroBusca) => {
        setFiltrosBusca(filtros);
        setModoBusca(true);
        setPaginaBusca(1); // Reset para primeira página
    };

    const voltarParaListagem = () => {
        setModoBusca(false);
        setFiltrosBusca(null);
        setPaginaBusca(1);
    };

    const irParaPaginaBusca = (numeroPagina: number) => {
        setPaginaBusca(numeroPagina);
    };

    const irParaPaginaAnteriorBusca = () => {
        if (paginaBusca > 1) {
            setPaginaBusca(paginaBusca - 1);
        }
    };

    const irParaProximaPaginaBusca = () => {
        if (paginaBusca < totalPaginasBusca) {
            setPaginaBusca(paginaBusca + 1);
        }
    };

    const irParaPrimeiraPaginaBusca = () => {
        setPaginaBusca(1);
    };

    const irParaUltimaPaginaBusca = () => {
        setPaginaBusca(totalPaginasBusca);
    };

    if (carregandoDados) {
        return <LoadingSkeleton />;
    }
    
    if (erroCarregamento) {
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
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '8px',
                        maxWidth: '1200px',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* Formulário de Busca */}
                    <div 
                        className="hero-busca"
                        style={{
                            flex: '1',
                            maxWidth: '400px'
                        }}
                    >
                        <FormularioBuscaSimples 
                            onBuscar={handleBuscar} 
                            onLimpar={voltarParaListagem}
                        />
                    </div>

                    {/* Estatísticas */}
                    <div 
                        className="hero-estatisticas"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '24px',
                            alignItems: 'center',
                            height: 'fit-content'
                        }}
                    >
                        <div style={{
                            textAlign: 'center',
                            minWidth: '140px'
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
                                fontSize: '48px',
                                fontWeight: '700',
                                lineHeight: '1',
                                color: '#16a34a'
                            }}>
                                {estatisticas?.quantPessoasEncontradas || 0}
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            minWidth: '140px'
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
                                fontSize: '48px',
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
                            <div>
                                <h2 style={{ 
                                    fontSize: 24, 
                                    fontWeight: 600,
                                    margin: 0,
                                    marginBottom: 4
                                }}>
                                    Resultados da Busca - {statusAtivo === 'DESAPARECIDO' ? 'Pessoas Desaparecidas' : 'Pessoas Localizadas'}
                                </h2>
                                {totalResultadosBusca > 0 && (
                                    <p style={{ 
                                        fontSize: 14, 
                                        color: '#6b7280',
                                        margin: 0
                                    }}>
                                        {totalResultadosBusca} {totalResultadosBusca === 1 ? 'pessoa encontrada' : 'pessoas encontradas'}
                                        {totalPaginasBusca > 1 && ` • Página ${paginaBusca} de ${totalPaginasBusca}`}
                                    </p>
                                )}
                            </div>
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
                            <>
                                <div className="cards-grid">
                                    {resultadosBusca.map((pessoa: Pessoa) => (
                                        <CardPessoa key={pessoa.id} {...pessoa} />
                                    ))}
                                </div>
                                
                                {/* Controles de paginação para busca */}
                                {totalPaginasBusca > 1 && (
                                    <ControlesPaginacao
                                        paginaAtual={paginaBusca}
                                        totalPaginas={totalPaginasBusca}
                                        totalRegistros={totalResultadosBusca}
                                        irParaPagina={irParaPaginaBusca}
                                        irParaPaginaAnterior={irParaPaginaAnteriorBusca}
                                        irParaProximaPagina={irParaProximaPaginaBusca}
                                        irParaPrimeiraPagina={irParaPrimeiraPaginaBusca}
                                        irParaUltimaPagina={irParaUltimaPaginaBusca}
                                        temPaginaAnterior={paginaBusca > 1}
                                        temProximaPagina={paginaBusca < totalPaginasBusca}
                                    />
                                )}
                            </>
                        ) : (
                            /* Área vazia - o modal será mostrado quando não houver resultados */
                            <div style={{ minHeight: '200px' }} />
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
                            <div className="cards-grid">
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
                                Debug: Total de registros = {totalRegistros} | Total de páginas = {totalPaginas}
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

            {/* Modal para quando não há resultados na busca */}
            <Modal
                isOpen={modalNenhumResultado}
                onClose={() => setModalNenhumResultado(false)}
                title="Nenhum resultado encontrado"
                type="warning"
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ 
                        fontSize: '16px', 
                        lineHeight: '1.6', 
                        color: '#374151',
                        margin: '0 0 16px 0'
                    }}>
                        {statusAtivo === 'DESAPARECIDO' 
                            ? 'Nenhuma pessoa desaparecida corresponde aos critérios de busca informados.'
                            : 'Nenhuma pessoa localizada corresponde aos critérios de busca informados.'
                        }
                    </p>
                    <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280',
                        margin: '0 0 24px 0'
                    }}>
                        {statusAtivo === 'DESAPARECIDO' 
                            ? 'Tente ajustar os filtros e buscar novamente, ou verifique se há pessoas com essas características.'
                            : 'Tente ajustar os filtros ou verificar se há pessoas localizadas com essas características.'
                        }
                    </p>
                    
                    {/* Botões */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => {
                                setModalNenhumResultado(false);
                                voltarParaListagem();
                            }}
                            style={{
                                backgroundColor: '#6b7280',
                                color: 'white',
                                fontWeight: '500',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Voltar à listagem
                        </button>
                        <button
                            onClick={() => setModalNenhumResultado(false)}
                            style={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                fontWeight: '500',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Tentar nova busca
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Home;
