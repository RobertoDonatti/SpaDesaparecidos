//componente criado para substituir o formulário de informações do botão "Enviar Informação" na página de detalhes da pessoa
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface FormularioDetalhePessoaProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  informacao: string;
  dataInformacao: string;
  arquivo?: File;
}

const FormularioDetalhePessoa: React.FC<FormularioDetalhePessoaProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    informacao: '',
    dataInformacao: '',
    arquivo: undefined
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.informacao.trim()) {
      newErrors.informacao = 'Informação é obrigatória';
    }

    if (!formData.dataInformacao) {
      newErrors.dataInformacao = 'Data da informação é obrigatória';
    }

    if (formData.arquivo) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(formData.arquivo.type)) {
        newErrors.arquivo = 'Apenas arquivos JPG, JPEG ou PNG são permitidos';
      } else if (formData.arquivo.size > maxSize) {
        newErrors.arquivo = 'O arquivo deve ter no máximo 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
        setIsSuccess(true);
        
        // Resetar formulário após sucesso
        setFormData({
          informacao: '',
          dataInformacao: '',
          arquivo: undefined
        });
        
        // Fechar automaticamente após 2 segundos
        setTimeout(() => {
          setIsSuccess(false);
          onCancel();
        }, 3000);
      } catch (error) {
        console.error('Erro no envio:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(prev => ({ ...prev, arquivo: file }));
    
    // Limpar erro do arquivo quando um novo é selecionado
    if (errors.arquivo) {
      setErrors(prev => ({ ...prev, arquivo: '' }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={(e) => {
        // Fechar modal se clicar no overlay (fora do modal)
        if (e.target === e.currentTarget && !isLoading) {
          onCancel();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #f3f4f6',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827', 
              margin: 0 
            }}>
              Formulário de Informações
            </h2>
            <button
              onClick={onCancel}
              style={{
                color: '#9ca3af',
                fontSize: '20px',
                fontWeight: 'normal',
                lineHeight: 1,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#059669', marginBottom: '8px', margin: 0 }}>
                Informação enviada com sucesso!
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0 0 0' }}>
                Obrigado por ajudar. Sua informação foi registrada e pode ser fundamental para localizar essa pessoa.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Campo Informação */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '6px' 
          }}>
            Informação <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            value={formData.informacao}
            onChange={(e) => handleInputChange('informacao', e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.informacao ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          {errors.informacao && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', margin: '4px 0 0 0' }}>{errors.informacao}</p>
          )}
        </div>

        {/* Campo Data */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '6px' 
          }}>
            Data
          </label>
          <input
            type="date"
            value={formData.dataInformacao}
            onChange={(e) => handleInputChange('dataInformacao', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.dataInformacao ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.dataInformacao && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', margin: '4px 0 0 0' }}>{errors.dataInformacao}</p>
          )}
        </div>

        {/* Upload de arquivo */}
        <div>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'inline-block' }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: '#22c55e',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}>
                Upload
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <p style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px', 
            margin: '4px 0 0 0' 
          }}>
            PNG, JPG, JPEG - 5MB
          </p>
          {errors.arquivo && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', margin: '4px 0 0 0' }}>{errors.arquivo}</p>
          )}
          {formData.arquivo && (
            <p style={{ 
              color: '#059669', 
              fontSize: '12px', 
              marginTop: '4px', 
              margin: '4px 0 0 0' 
            }}>
              Arquivo selecionado: {formData.arquivo.name}
            </p>
          )}
        </div>

        {/* Botões */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          paddingTop: '8px',
          borderTop: '1px solid #f3f4f6',
          marginTop: '8px'
        }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: '500',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '500',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
      )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FormularioDetalhePessoa;