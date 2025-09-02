import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryString } from '../../../utils/useQueryString'


const schema = z.object({
q: z.string().optional(),
sexo: z.enum(['M','F','N']).optional(),
cidade: z.string().optional(),
})


type FormValues = z.infer<typeof schema>


export default function FiltersForm() {
const { params, set } = useQueryString()


const { register, handleSubmit, reset } = useForm<FormValues>({
resolver: zodResolver(schema),
defaultValues: {
q: params.get('q') ?? '',
sexo: (params.get('sexo') as 'M'|'F'|'N'|null) ?? undefined,
cidade: params.get('cidade') ?? '',
},
})


function onSubmit(values: FormValues) {
set({ q: values.q || undefined, sexo: values.sexo, cidade: values.cidade, page: 1 })
}


function onClear() {
reset({ q: '', sexo: undefined, cidade: '' })
set({ q: undefined, sexo: undefined, cidade: undefined, page: 1 })
}


return (
<form onSubmit={handleSubmit(onSubmit)} className="">
<input {...register('q')} placeholder="Nome" className="" />
<select {...register('sexo')} className="">
<option value="">Sexo</option>
<option value="M">Masculino</option>
<option value="F">Feminino</option>
<option value="N">Não informado</option>
</select>
<input {...register('cidade')} placeholder="Cidade" className="" />


<div className="sm:col-span-3 flex gap-2">
<button type="submit" className="">Aplicar</button>
<button type="button" onClick={onClear} className="">Limpar</button>
</div>
</form>
)
}