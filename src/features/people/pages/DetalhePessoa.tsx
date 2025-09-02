import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPerson } from '../api'
import Loading from '../../../components/Loading'
import EmptyState from '../../../components/EmptyState'
import { useState } from 'react'
import EnviarInformacaoForm from '../components/EnviarInformacaoForm'


export default function PersonDetails() {
const [showForm, setShowForm] = useState(false)
const { id } = useParams<{ id: string }>()
const { data, isLoading, isError } = useQuery({
queryKey: ['person', id],
queryFn: () => getPerson(id!),
enabled: !!id,
})


if (isLoading) return <Loading />
if (isError || !data) return <EmptyState title="Não encontrado" description="Registro inexistente." />


return (
<article>
<div>
{data.fotoUrl && <img src={data.fotoUrl} alt={data.nome} />}
</div>
<div>
<h1>{data.nome}</h1>
<p>
	<span style={{ padding: '2px 8px', borderRadius: 6, fontWeight: 600, color: '#fff', background: data.status === 'Localizada' ? '#22c55e' : '#ef4444' }}>
		{data.status === 'Localizada' ? 'Localizada' : 'Desaparecido'}
	</span>
	</p>
<dl>
<div><dt>Sexo</dt><dd>{data.sexo || '—'}</dd></div>
<div><dt>Idade</dt><dd>{data.idade ?? '—'}</dd></div>
<div><dt>Cidade</dt><dd>{data.cidade ?? '—'}{data.uf ? `/${data.uf}` : ''}</dd></div>
<div><dt>Desde</dt><dd>{data.dataDesaparecimento ? new Date(data.dataDesaparecimento).toLocaleDateString() : '—'}</dd></div>
</dl>
<p>Se tiver alguma informação, entre em contato com as autoridades locais.</p>
<div>
	<button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Fechar' : 'Enviar informação'}</button>
	{showForm && (
		<div>
			<EnviarInformacaoForm personId={id!} onSubmitted={() => setShowForm(false)} />
		</div>
	)}
</div>
</div>
</article>
)
}