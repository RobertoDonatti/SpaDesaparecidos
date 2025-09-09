import { useSearchParams } from 'react-router-dom'

export function useQueryString() {
  const [params, setParams] = useSearchParams()

  function set(obj: Record<string, string | number | boolean | undefined>) {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null || v === '') next.delete(k)
      else next.set(k, String(v))
    }
    setParams(next, { replace: true })
  }

  return { params, set }
}