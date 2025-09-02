import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'


export default function Header() {
return (
<header>
<div>
<Link to="/">Projeto Pratico</Link>
<nav>
<ThemeToggle />
</nav>
</div>
</header>
)
}