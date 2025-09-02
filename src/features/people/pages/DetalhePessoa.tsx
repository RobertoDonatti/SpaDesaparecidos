import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPerson } from '../api'
import Loading from '../../../components/Loading'
import EmptyState from '../../../components/EmptyState'


export default function PersonDetails() {
const { id } = useParams<{ id: string }>()
const { data, isLoading, isError } = useQuery({
queryKey: ['person', id],
queryFn: () => getPerson(id!),
enabled: !!id,
})


if (isLoading) return <Loading />
if (isError || !data) return <EmptyState title="Não encontrado" description="Registro inexistente." />


return (
<article className="">
<div className="">
{data.fotoUrl && <img src={data.fotoUrl} alt={data.nome} className="" />}
</div>
<div className="">
<h1 className="">{data.nome}</h1>
<dl className="">
<div><dt className="">Sexo</dt><dd>{data.sexo || '—'}</dd></div>
<div><dt className="">Idade</dt><dd>{data.idade ?? '—'}</dd></div>
<div><dt className="">Cidade</dt><dd>{data.cidade ?? '—'}{data.uf ? `/${data.uf}` : ''}</dd></div>
<div><dt className="">Desde</dt><dd>{data.dataDesaparecimento ? new Date(data.dataDesaparecimento).toLocaleDateString() : '—'}</dd></div>
</dl>
<p className="">Se tiver alguma informação, entre em contato com as autoridades locais.</p>
</div>
</article>
)
}