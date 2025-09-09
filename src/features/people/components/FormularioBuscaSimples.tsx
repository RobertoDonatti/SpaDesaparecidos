import React, { useState, useEffect } from 'react';
import type { FiltroBusca } from '../types';

interface FormularioBuscaSimplesProps {
    onBuscar: (filtros: FiltroBusca) => void;
    onLimpar?: () => void;
}

export function FormularioBuscaSimples({ onBuscar, onLimpar }: FormularioBuscaSimplesProps) {
    const [filtros, setFiltros] = useState<FiltroBusca>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isMobile, setIsMobile] = useState(false);
    const [isVerySmall, setIsVerySmall] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsVerySmall(width < 400);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        const nomePreenchido = filtros.nome && filtros.nome.trim() !== '';
        const sexoPreenchido = filtros.sexo !== undefined;
        const idadeMinPreenchida = filtros.idadeMinima !== undefined && filtros.idadeMinima !== null;
        const idadeMaxPreenchida = filtros.idadeMaxima !== undefined && filtros.idadeMaxima !== null;
        
        if (!nomePreenchido && !sexoPreenchido && !idadeMinPreenchida && !idadeMaxPreenchida) {
            newErrors.geral = 'Preencha pelo menos um campo para buscar';
        }

        if (filtros.idadeMinima !== undefined) {
            const idadeMin = Number(filtros.idadeMinima);
            if (isNaN(idadeMin) || idadeMin < 0) {
                newErrors.geral = 'Idade mínima deve ser um número maior ou igual a 0';
            }
        }

        if (filtros.idadeMaxima !== undefined) {
            const idadeMax = Number(filtros.idadeMaxima);
            if (isNaN(idadeMax) || idadeMax < 0) {
                newErrors.geral = 'Idade máxima deve ser um número maior ou igual a 0';
            }
        }

        if (filtros.idadeMinima !== undefined && filtros.idadeMaxima !== undefined) {
            const idadeMin = Number(filtros.idadeMinima);
            const idadeMax = Number(filtros.idadeMaxima);
            if (idadeMin > idadeMax) {
                newErrors.geral = 'Idade mínima não pode ser maior que a idade máxima';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            onBuscar(filtros);
        }
    };

    const handleLimpar = () => {
        setFiltros({});
        setErrors({});
        if (onLimpar) {
            onLimpar();
        }
    };

    const handleInputChange = (campo: keyof FiltroBusca, valor: string | number | undefined) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor === '' ? undefined : valor
        }));

        if (errors.geral && valor !== '' && valor !== undefined) {
            setErrors(prev => ({ ...prev, geral: '' }));
        }
    };

    return (
        <div style={{
            ...estiloFormulario,
            padding: isVerySmall ? '12px' : isMobile ? '16px' : '24px'
        }}>
            <h2 style={{
                ...estiloTitulo,
                fontSize: isVerySmall ? '16px' : isMobile ? '18px' : '20px',
                marginBottom: isVerySmall ? '12px' : '16px'
            }}>
                {isVerySmall ? "Buscar Pessoa" : "Buscar Pessoa Desaparecida"}
            </h2>
            
            {/* Erro geral */}
            {errors.geral && (
                <div style={{ 
                    background: '#fef2f2', 
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                }}>
                    <p style={{ 
                        color: '#dc2626', 
                        fontSize: '14px', 
                        margin: 0,
                        fontWeight: '500'
                    }}>
                        {errors.geral}
                    </p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} style={estiloForm}>
                {/* Primeira linha: Nome e Sexo */}
                <div style={{
                    ...estiloLinhaSuperior,
                    gridTemplateColumns: isVerySmall ? '1fr' : isMobile ? 'repeat(auto-fit, minmax(120px, 1fr))' : 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: isVerySmall ? '8px' : '12px'
                }}>
                    {/* Campo Nome */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Nome</label>
                        <input
                            type="text"
                            placeholder={isVerySmall ? "Nome" : isMobile ? "Nome da pessoa" : "Digite o nome da pessoa"}
                            value={filtros.nome || ''}
                            onChange={(e) => handleInputChange('nome', e.target.value)}
                            style={{
                                ...estiloInput,
                                borderColor: errors.geral ? '#ef4444' : '#d1d5db'
                            }}
                        />
                    </div>

                    {/* Campo Sexo */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Sexo</label>
                        <select
                            value={filtros.sexo || ''}
                            onChange={(e) => handleInputChange('sexo', e.target.value as 'M' | 'F')}
                            style={{
                                ...estiloInput,
                                borderColor: errors.geral ? '#ef4444' : '#d1d5db'
                            }}
                        >
                            <option value="">Todos</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                    </div>
                </div>

                {/* Segunda linha: Idades */}
                <div style={{
                    ...estiloLinhaIdades,
                    gridTemplateColumns: isVerySmall ? '1fr' : isMobile ? 'repeat(auto-fit, minmax(80px, 1fr))' : 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: isVerySmall ? '8px' : '12px'
                }}>
                    {/* Campo Idade Mínima */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Idade Mínima</label>
                        <input
                            type="number"
                            placeholder={isVerySmall ? "0" : isMobile ? "Min" : "Ex: 18"}
                            min="0"
                            max="120"
                            value={filtros.idadeMinima !== undefined ? filtros.idadeMinima : ''}
                            onChange={(e) => {
                                const valor = e.target.value;
                                if (valor === '') {
                                    handleInputChange('idadeMinima', undefined);
                                } else {
                                    const numeroValor = parseInt(valor);
                                    handleInputChange('idadeMinima', isNaN(numeroValor) ? undefined : numeroValor);
                                }
                            }}
                            style={{
                                ...estiloInput,
                                borderColor: errors.geral ? '#ef4444' : '#d1d5db'
                            }}
                        />
                    </div>

                    {/* Campo Idade Máxima */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Idade Máxima</label>
                        <input
                            type="number"
                            placeholder={isVerySmall ? "120" : isMobile ? "Máx" : "Ex: 65"}
                            min="0"
                            max="120"
                            value={filtros.idadeMaxima !== undefined ? filtros.idadeMaxima : ''}
                            onChange={(e) => {
                                const valor = e.target.value;
                                if (valor === '') {
                                    handleInputChange('idadeMaxima', undefined);
                                } else {
                                    const numeroValor = parseInt(valor);
                                    handleInputChange('idadeMaxima', isNaN(numeroValor) ? undefined : numeroValor);
                                }
                            }}
                            style={{
                                ...estiloInput,
                                borderColor: errors.geral ? '#ef4444' : '#d1d5db'
                            }}
                        />
                    </div>
                </div>

                {/* Botões */}
                <div style={{
                    ...estiloBotoes,
                    flexDirection: isVerySmall ? 'column' : 'row',
                    gap: isVerySmall ? '8px' : '12px'
                }}>
                    <button
                        type="submit"
                        style={{
                            padding: isVerySmall ? '12px 16px' : '14px 24px',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: '#dc2626',
                            borderRadius: '6px',
                            fontSize: isVerySmall ? '14px' : '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            height: isVerySmall ? '42px' : '48px',
                            flex: '1',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            minWidth: isVerySmall ? 'auto' : '120px'
                        }}
                    >
                        {isVerySmall ? 'BUSCAR' : '🔍 BUSCAR'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleLimpar}
                        style={{
                            padding: isVerySmall ? '12px 16px' : '14px 24px',
                            backgroundColor: '#ffffff',
                            color: '#374151',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: '#d1d5db',
                            borderRadius: '6px',
                            fontSize: isVerySmall ? '14px' : '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            height: isVerySmall ? '42px' : '48px',
                            flex: '1',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: isVerySmall ? 'auto' : '120px'
                        }}
                    >
                        {isVerySmall ? 'LIMPAR' : '❌ LIMPAR'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const estiloFormulario: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
};

const estiloTitulo: React.CSSProperties = {
    margin: '0 0 16px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    wordWrap: 'break-word',
    lineHeight: '1.2'
};

const estiloForm: React.CSSProperties = {
    width: '100%'
};

const estiloLinhaSuperior: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '12px'
};

const estiloLinhaIdades: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
};

const estiloCampo: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
};

const estiloLabel: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151'
};

const estiloInput: React.CSSProperties = {
    padding: '10px 12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    minWidth: '0',
    height: '44px'
};

const estiloBotoes: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'stretch',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: '16px'
};
