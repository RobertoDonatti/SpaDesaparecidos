export type Pessoa = {
	id: number
	nome: string
	sexo: 'MASCULINO' | 'FEMININO'
	idade: number
	vivo: true
	urlFoto: string
	ultimaOcorrencia: {
		dtDesaparecimento: string
		dataLocalizacao: string | null
		encontradoVivo: true 
		//Alterado de boolean para true pois, havia implementado uma lógica caso a pessoa fosse encontrada sem vida porém, na documentação da API, verifiquei que sempre retornará true quando a pessoa for localizada ou não.
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
	nome?: string
	sexo?: 'MASCULINO' | 'FEMININO'
	cidade?: string
	page?: number
	size?: number
	registros?: number
}