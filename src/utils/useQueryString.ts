import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


export function useQueryString() {
const { search, pathname } = useLocation()
const navigate = useNavigate()


const params = useMemo(() => new URLSearchParams(search), [search])


function set(next: Record<string, string | number | undefined | null>) {
const p = new URLSearchParams(search)
Object.entries(next).forEach(([k, v]) => {
if (v === undefined || v === null || v === '') p.delete(k)
else p.set(k, String(v))
})
navigate({ pathname, search: p.toString() }, { replace: true })
}


return { params, set }
}