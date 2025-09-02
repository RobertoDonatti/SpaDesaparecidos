export type Pessoa = {
id: string
nome: string
sexo?: 'M' | 'F' | 'N'
idade?: number
cidade?: string
uf?: string
dataDesaparecimento?: string // ISO
fotoUrl?: string
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
sexo?: 'M' | 'F' | 'N'
cidade?: string
page?: number
size?: number
}