import Header from '../components/Header'
import { AppRoutes } from './router'


export default function App() {
return (
<div className="Header">
<Header />
<main className="NomeClasse">
<AppRoutes />
</main>
<footer className="Footer">
Projeto Pratico — v1
</footer>
</div>
)
}