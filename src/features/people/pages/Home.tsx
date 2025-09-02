import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listPeople } from '../api'
import { Person } from '../types'
import FiltersForm from '../components/FiltroFormulario'
import PersonCard from '../components/CardPessoa'
import EmptyState from '../../../components/EmptyState'
import Loading from '../../../components/Loading'


export default function Home() {
const [parametroDeBusca, setparametroDeBusca] = useSearchParams()
const page = Number(parametroDeBusca.get('page') ?? '1')
const size = Number(parametroDeBusca.get('size') ?? '12')


const { data, isLoading, isError } = useQuery({
queryKey: ['people', Object.fromEntries(parametroDeBusca)],
queryFn: () => listPeople({
q: parametroDeBusca.get('q') ?? undefined,
sexo: (parametroDeBusca.get('sexo') as 'M'|'F'|'N'|null) ?? undefined,
cidade: parametroDeBusca.get('cidade') ?? undefined,
page, size,
}),
keepPreviousData: true,
})


function go(p: number) {
parametroDeBusca.set('page', String(p))
setparametroDeBusca(parametroDeBusca, { replace: true })
}


return (
<section className="">
<h1 className="">Pessoas desaparecidas</h1>
<FiltersForm />


{isLoading && <Loading />}
{isError && <EmptyState title="Erro ao carregar" description="Tente novamente mais tarde." />}


{data && data.items.length === 0 && (
<EmptyState title="Nada encontrado" description="Ajuste os filtros e tente outra busca." />
)}


{data && data.items.length > 0 && (
<>
<div className="">
{data.items.map((p: Person) => (
<PersonCard key={p.id} p={p} />
))}
</div>


<div className="">
<button
className=""
onClick={() => go(page - 1)}
disabled={page <= 1}
>Anterior</button>
<span className="">Página {page} de {data.totalPages}</span>
<button
className=""
onClick={() => go(page + 1)}
disabled={page >= data.totalPages}
>Próxima</button>
</div>
</>
)}
</section>
)
}