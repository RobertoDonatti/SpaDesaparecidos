import { Link } from 'react-router-dom'
import type { Pessoa } from '../types'


export default function PersonCard({ p }: { p: Pessoa }) {
return (
<article className="">
<div className="">
{p.fotoUrl ? (
<img src={p.fotoUrl} alt={p.nome} className="" />
) : (
<div className="">Sem foto</div>
)}
</div>
<div className="">
<h3 className="">{p.nome}</h3>
<p className="">
{p.cidade ? `${p.cidade}${p.uf ? `/${p.uf}` : ''}` : 'Cidade não informada'}
</p>
<Link
to={`/pessoa/${p.id}`}
className=""
>
Ver detalhes
</Link>
</div>
</article>
)
}