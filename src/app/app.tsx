import Header from '../components/Header'
import { AppRoutes } from './router'


export default function App() {
return (
<div>
<Header />
<main>
<AppRoutes />
</main>
<footer>
Projeto SPA-Desaparecidos
</footer>
</div>
)
}