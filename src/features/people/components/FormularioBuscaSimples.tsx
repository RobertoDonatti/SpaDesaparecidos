import React, { useState } from 'react';
import type { FiltroBusca } from '../types';

interface FormularioBuscaSimplesProps {
    onBuscar: (filtros: FiltroBusca) => void;
    onLimpar?: () => void;
}

export function FormularioBuscaSimples({ onBuscar, onLimpar }: FormularioBuscaSimplesProps) {
    const [filtros, setFiltros] = useState<FiltroBusca>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Verificar se pelo menos um filtro foi preenchido
        if (!filtros.nome && !filtros.sexo && !filtros.idadeMinima && !filtros.idadeMaxima) {
            newErrors.geral = 'Preencha pelo menos um campo para buscar';
        }

        // Validar idade mínima
        if (filtros.idadeMinima !== undefined) {
            const idadeMin = Number(filtros.idadeMinima);
            if (isNaN(idadeMin) || idadeMin <= 0) {
                newErrors.geral = 'Idade mínima deve ser um número maior que 0';
            }
        }

        // Validar idade máxima
        if (filtros.idadeMaxima !== undefined) {
            const idadeMax = Number(filtros.idadeMaxima);
            if (isNaN(idadeMax) || idadeMax <= 0) {
                newErrors.geral = 'Idade máxima deve ser um número maior que 0';
            }
        }

        // Validar se idade mínima é menor que máxima
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
        // Chamar a função de limpar do componente pai se existir
        if (onLimpar) {
            onLimpar();
        }
    };

    const handleInputChange = (campo: keyof FiltroBusca, valor: string | number | undefined) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor === '' ? undefined : valor
        }));

        // Limpar erro geral quando o usuário começar a preencher algum campo
        if (errors.geral && valor !== '' && valor !== undefined) {
            setErrors(prev => ({ ...prev, geral: '' }));
        }
    };

    return (
        <div style={estiloFormulario}>
            <h2 style={estiloTitulo}>Buscar Pessoa Desaparecida</h2>
            
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
                <div style={estiloLinhaSuperior}>
                    {/* Campo Nome */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Nome</label>
                        <input
                            type="text"
                            placeholder="Digite o nome da pessoa"
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
                <div style={estiloLinhaIdades}>
                    {/* Campo Idade Mínima */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Idade Mínima</label>
                        <input
                            type="number"
                            placeholder="Ex: 18"
                            min="1"
                            max="120"
                            value={filtros.idadeMinima || ''}
                            onChange={(e) => handleInputChange('idadeMinima', e.target.value ? parseInt(e.target.value) : undefined)}
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
                            placeholder="Ex: 65"
                            min="1"
                            max="120"
                            value={filtros.idadeMaxima || ''}
                            onChange={(e) => handleInputChange('idadeMaxima', e.target.value ? parseInt(e.target.value) : undefined)}
                            style={{
                                ...estiloInput,
                                borderColor: errors.geral ? '#ef4444' : '#d1d5db'
                            }}
                        />
                    </div>
                </div>

                {/* Botões */}
                <div style={estiloBotoes}>
                    <button
                        type="submit"
                        style={estiloBotaoPrimario}
                    >
                        Buscar
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleLimpar}
                        style={estiloBotaoSecundario}
                    >
                        Limpar
                    </button>
                </div>
            </form>
        </div>
    );
}

// Estilos
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
    color: '#1f2937'
};

const estiloForm: React.CSSProperties = {
    width: '100%'
};

const estiloLinhaSuperior: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px'
};

const estiloLinhaIdades: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
    padding: '8px 12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
};

const estiloBotoes: React.CSSProperties = {
    display: 'flex',
    gap: '6px',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
};

const estiloBotaoPrimario: React.CSSProperties = {
    padding: '10px 16px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#dc2626',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flex: '1',
    minWidth: '100px'
};

const estiloBotaoSecundario: React.CSSProperties = {
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    color: '#374151',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flex: '1',
    minWidth: '100px'
};
