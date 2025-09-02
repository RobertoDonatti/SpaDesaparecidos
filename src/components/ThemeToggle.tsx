import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../app/providers/ThemeProvider'


export default function ThemeToggle() {
const { theme, setTheme } = useTheme()
const isDark = theme === 'dark'


return (
<button
className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
onClick={() => setTheme(isDark ? 'light' : 'dark')}
aria-label="Alternar tema"
>
{isDark ? <Sun size={16} /> : <Moon size={16} />}
<span className="hidden sm:inline">{isDark ? 'Claro' : 'Escuro'}</span>
</button>
)
}