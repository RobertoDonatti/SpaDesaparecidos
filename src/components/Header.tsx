import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'


export default function Header() {
return (
<header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 border-b border-gray-200/10">
<div className="container mx-auto max-w-[var(--container)] px-4 h-14 flex items-center justify-between">
<Link to="/" className="font-semibold">Projeto Pratico</Link>
<nav className="flex items-center gap-2">
<ThemeToggle />
</nav>
</div>
</header>
)
}