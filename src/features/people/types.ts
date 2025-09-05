export type Pessoa = {
	id: number
	nome: string
	sexo: 'MASCULINO' | 'FEMININO'
	idade: number
	vivo: boolean
	urlFoto: string
	ultimaOcorrencia: {
		dtDesaparecimento: string
		dataLocalizacao: string | null
		encontradoVivo: boolean
		localDesaparecimentoConcat: string
		ocorrenciaEntrevDesapDTO: {
			informacao: string | null
			vestimentasDesaparecido: string
		} | null
		listaCartaz: unknown[]
		ocoId: number
	}
}

export type PageResponse<T> = {
	items: T[]
	page: number
	size: number
	total: number
	totalPages: number
}

export type FiltroPessoa = {
	q?: string
	sexo?: 'MASCULINO' | 'FEMININO'
	cidade?: string
	page?: number
	size?: number
	registros?: number
}