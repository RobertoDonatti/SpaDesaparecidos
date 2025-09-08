import React, { useState } from 'react';
import type { FiltroBusca } from '../types';

interface FormularioBuscaSimplesProps {
    onBuscar: (filtros: FiltroBusca) => void;
}

export function FormularioBuscaSimples({ onBuscar }: FormularioBuscaSimplesProps) {
    const [filtros, setFiltros] = useState<FiltroBusca>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Verificar se pelo menos um filtro foi preenchido
        if (!filtros.nome && !filtros.sexo && !filtros.idadeMinima && !filtros.idadeMaxima) {
            alert('Por favor, preencha pelo menos um campo para buscar');
            return;
        }

        onBuscar(filtros);
    };

    const handleLimpar = () => {
        setFiltros({});
    };

    const handleInputChange = (campo: keyof FiltroBusca, valor: string | number) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor === '' ? undefined : valor
        }));
    };

    return (
        <div style={estiloFormulario}>
            <h2 style={estiloTitulo}>🔍 Buscar Pessoa Desaparecida</h2>
            
            <form onSubmit={handleSubmit} style={estiloForm}>
                <div style={estiloGrid}>
                    {/* Campo Nome */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Nome</label>
                        <input
                            type="text"
                            placeholder="Digite o nome da pessoa"
                            value={filtros.nome || ''}
                            onChange={(e) => handleInputChange('nome', e.target.value)}
                            style={estiloInput}
                        />
                    </div>

                    {/* Campo Sexo */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Sexo</label>
                        <select
                            value={filtros.sexo || ''}
                            onChange={(e) => handleInputChange('sexo', e.target.value as 'M' | 'F')}
                            style={estiloInput}
                        >
                            <option value="">Todos</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                    </div>

                    {/* Campo Idade Mínima */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Idade Mínima</label>
                        <input
                            type="number"
                            placeholder="Ex: 18"
                            min="0"
                            max="120"
                            value={filtros.idadeMinima || ''}
                            onChange={(e) => handleInputChange('idadeMinima', parseInt(e.target.value) || '')}
                            style={estiloInput}
                        />
                    </div>

                    {/* Campo Idade Máxima */}
                    <div style={estiloCampo}>
                        <label style={estiloLabel}>Idade Máxima</label>
                        <input
                            type="number"
                            placeholder="Ex: 65"
                            min="0"
                            max="120"
                            value={filtros.idadeMaxima || ''}
                            onChange={(e) => handleInputChange('idadeMaxima', parseInt(e.target.value) || '')}
                            style={estiloInput}
                        />
                    </div>
                </div>

                {/* Botões */}
                <div style={estiloBotoes}>
                    <button
                        type="submit"
                        style={estiloBotaoPrimario}
                    >
                        🔍 Buscar
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleLimpar}
                        style={estiloBotaoSecundario}
                    >
                        🗑️ Limpar
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
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937'
};

const estiloForm: React.CSSProperties = {
    width: '100%'
};

const estiloGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
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
    padding: '8px 10px',
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
    gap: '8px',
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
