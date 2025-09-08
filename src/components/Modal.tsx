import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'success': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning': return '#fef3c7';
      case 'error': return '#fef2f2';
      case 'success': return '#f0fdf4';
      default: return '#f0f9ff';
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
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '480px',
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '16px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                backgroundColor: getBackgroundColor(),
                borderRadius: '50%',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle 
                  size={24} 
                  color={getIconColor()}
                />
              </div>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#111827', 
                margin: 0 
              }}>
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
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
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
