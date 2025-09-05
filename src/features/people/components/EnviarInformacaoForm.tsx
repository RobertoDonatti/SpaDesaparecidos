import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = { personId: string; onSubmitted?: () => void }

type FormValues = {
  observacao: string
  telefone?: string
  email?: string
}

export default function EnviarInformacaoForm({ personId, onSubmitted }: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  const onSubmit = async (v: FormValues) => {
    setLoading(true); setError(null); setOk(false)
    try {
      // Simular envio da informação (implementar quando tiver API real)
      console.log('Enviando informação para pessoa:', personId, v);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOk(true)
      reset()
      setTimeout(() => {
        onSubmitted?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar')
    }
    setLoading(false)
  }

  if (ok) return (
    <div style={{ 
      textAlign: 'center', 
      padding: 24, 
      background: '#f0fdf4', 
      border: '1px solid #bbf7d0',
      borderRadius: 8,
      color: '#166534'
    }}>
      ✅ Informação enviada com sucesso! Obrigado por ajudar.
    </div>
  )

  return (
    <div>
      <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Enviar Informação</h3>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Informação *
          </label>
          <textarea 
            {...register('observacao', { required: true })}
            placeholder="Descreva onde você viu essa pessoa ou qualquer informação relevante..."
            rows={4}
            style={{ 
              width: '100%', 
              padding: 8, 
              border: '1px solid #d1d5db', 
              borderRadius: 4,
              fontSize: 14,
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Telefone (opcional)
            </label>
            <input 
              {...register('telefone')}
              type="tel"
              placeholder="(65) 99999-9999"
              style={{ 
                width: '100%', 
                padding: 8, 
                border: '1px solid #d1d5db', 
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Email (opcional)
            </label>
            <input 
              {...register('email')}
              type="email"
              placeholder="seu@email.com"
              style={{ 
                width: '100%', 
                padding: 8, 
                border: '1px solid #d1d5db', 
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ 
            color: '#dc2626', 
            background: '#fef2f2', 
            padding: 8, 
            borderRadius: 4,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#ef4444', 
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Informação'}
          </button>
          
          <button 
            type="button" 
            onClick={onSubmitted}
            style={{ 
              background: '#6b7280', 
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
