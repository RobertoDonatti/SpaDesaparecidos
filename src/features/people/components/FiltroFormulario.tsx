import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryString } from '../../../utils/useQueryString'


const schema = z.object({
nome: z.string().optional(),
sexo: z.enum(['MASCULINO','FEMININO']).optional(),
cidade: z.string().optional(),
})


type FormValues = z.infer<typeof schema>


type Props = {
	defaultValues?: { nome?: string; sexo?: 'MASCULINO'|'FEMININO'; cidade?: string };
	onSubmit?: (v: { nome?: string; sexo?: 'MASCULINO'|'FEMININO'; cidade?: string }) => void;
	onClear?: () => void;
}

export default function FiltroFormulario(props: Props) {
const { params, set } = useQueryString()


const { register, handleSubmit, reset } = useForm<FormValues>({
	resolver: zodResolver(schema),
	defaultValues: {
		nome: props.defaultValues?.nome ?? params.get('nome') ?? '',
		sexo: props.defaultValues?.sexo ?? ((params.get('sexo') as 'MASCULINO'|'FEMININO'|null) ?? undefined),
		cidade: props.defaultValues?.cidade ?? params.get('cidade') ?? '',
	},
})


function onSubmit(values: FormValues) {
	if (props.onSubmit) {
		props.onSubmit(values)
	} else {
		set({ nome: values.nome || undefined, sexo: values.sexo, cidade: values.cidade, page: 1 })
	}
}


function onClear() {
	reset({ nome: '', sexo: undefined, cidade: '' })
	if (props.onClear) props.onClear()
	else set({ nome: undefined, sexo: undefined, cidade: undefined, page: 1 })
}


return (
<form onSubmit={handleSubmit(onSubmit)} style={{ 
	display: 'flex', 
	gap: 16, 
	alignItems: 'center', 
	justifyContent: 'center',
	marginBottom: 30,
	padding: 20,
	background: '#f8f9fa',
	borderRadius: 8
}}>
<input 
	{...register('nome')} 
	placeholder="Nome" 
	style={{ 
		padding: '8px 12px', 
		border: '1px solid #ddd', 
		borderRadius: 4,
		minWidth: 150
	}} 
/>
<select 
	{...register('sexo')} 
	style={{ 
		padding: '8px 12px', 
		border: '1px solid #ddd', 
		borderRadius: 4,
		minWidth: 120
	}}
>
<option value="">Sexo</option>
<option value="MASCULINO">Masculino</option>
<option value="FEMININO">Feminino</option>
</select>
<input 
	{...register('cidade')} 
	placeholder="Cidade" 
	style={{ 
		padding: '8px 12px', 
		border: '1px solid #ddd', 
		borderRadius: 4,
		minWidth: 150
	}} 
/>

<div style={{ display: 'flex', gap: 8 }}>
<button 
	type="submit"
	style={{ 
		padding: '8px 16px', 
		background: '#007bff', 
		color: 'white', 
		border: 'none', 
		borderRadius: 4,
		cursor: 'pointer'
	}}
>
	Aplicar
</button>
<button 
	type="button" 
	onClick={onClear}
	style={{ 
		padding: '8px 16px', 
		background: '#6c757d', 
		color: 'white', 
		border: 'none', 
		borderRadius: 4,
		cursor: 'pointer'
	}}
>
	Limpar
</button>
</div>
</form>
)
}