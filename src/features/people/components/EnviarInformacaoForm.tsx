import { useState } from 'react'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { submitReport } from '../api'

type Props = { personId: string; onSubmitted?: () => void }

type FormValues = {
  observacao: string
  telefone?: string
  dataHora?: string
  lat?: string
  lng?: string
  fotos?: FileList
}

export default function EnviarInformacaoForm({ personId, onSubmitted }: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  const onSubmit = async (v: FormValues) => {
    setLoading(true); setError(null); setOk(false)
    try {
      await submitReport(personId, {
        observacao: v.observacao,
        telefone: v.telefone,
        dataHora: v.dataHora,
        lat: v.lat ? Number(v.lat) : undefined,
        lng: v.lng ? Number(v.lng) : undefined,
        fotos: v.fotos ? Array.from(v.fotos) : undefined,
      })
      setOk(true)
      reset()
      onSubmitted?.()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Observação
          <textarea {...register('observacao', { required: true })} rows={3} />
        </label>
      </div>
      <div>
        <label>
          Telefone
          <InputMask mask="(99) 99999-9999" {...register('telefone')}>
            {(inputProps: any) => <input {...inputProps} />}
          </InputMask>
        </label>
      </div>
      <div>
        <label>
          Data e hora
          <InputMask mask="99/99/9999 99:99" {...register('dataHora')}>
            {(inputProps: any) => <input {...inputProps} placeholder="dd/mm/aaaa hh:mm" />}
          </InputMask>
        </label>
      </div>
      <div>
        <label>
          Latitude
          <input {...register('lat')} placeholder="-15.60" />
        </label>
        <label>
          Longitude
          <input {...register('lng')} placeholder="-56.10" />
        </label>
      </div>
      <div>
        <label>
          Fotos (opcional)
          <input type="file" multiple accept="image/*" {...register('fotos')} />
        </label>
      </div>
      {error && <p>Erro: {error}</p>}
      {ok && <p>Enviado!</p>}
      <button type="submit" disabled={loading}>{loading ? 'Enviando…' : 'Enviar'}</button>
    </form>
  )
}
