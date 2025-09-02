import { api } from '../../lib/api'
import { PageResponse, FiltroPessoa, Pessoas } from './types'


export async function listPeople(filters: FiltroPessoa) {
const params = {
q: filters.q || undefined,
sexo: filters.sexo || undefined,
cidade: filters.cidade || undefined,
page: filters.page ?? 1,
size: filters.size ?? 12,
}
const { data } = await api.get<PageResponse<Pessoas>>('/pessoas', { params })
return data
}


export async function getPerson(id: string) {
const { data } = await api.get<Pessoas>(`/pessoas/${id}`)
return data
}