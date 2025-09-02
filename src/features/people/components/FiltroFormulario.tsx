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


type Props = {
	defaultValues?: { q?: string; sexo?: 'M'|'F'|'N'; cidade?: string };
	onSubmit?: (v: { q?: string; sexo?: 'M'|'F'|'N'; cidade?: string }) => void;
	onClear?: () => void;
}

export default function FiltersForm(props: Props) {
const { params, set } = useQueryString()


const { register, handleSubmit, reset } = useForm<FormValues>({
	resolver: zodResolver(schema),
	defaultValues: {
		q: props.defaultValues?.q ?? params.get('q') ?? '',
		sexo: props.defaultValues?.sexo ?? ((params.get('sexo') as 'M'|'F'|'N'|null) ?? undefined),
		cidade: props.defaultValues?.cidade ?? params.get('cidade') ?? '',
	},
})


function onSubmit(values: FormValues) {
	if (props.onSubmit) {
		props.onSubmit(values)
	} else {
		set({ q: values.q || undefined, sexo: values.sexo, cidade: values.cidade, page: 1 })
	}
}


function onClear() {
	reset({ q: '', sexo: undefined, cidade: '' })
	if (props.onClear) props.onClear()
	else set({ q: undefined, sexo: undefined, cidade: undefined, page: 1 })
}


return (
<form onSubmit={handleSubmit(onSubmit)}>
<input {...register('q')} placeholder="Nome" />
<select {...register('sexo')}>
<option value="">Sexo</option>
<option value="M">Masculino</option>
<option value="F">Feminino</option>
<option value="N">Não informado</option>
</select>
<input {...register('cidade')} placeholder="Cidade" />


<div>
<button type="submit">Aplicar</button>
<button type="button" onClick={onClear}>Limpar</button>
</div>
</form>
)
}