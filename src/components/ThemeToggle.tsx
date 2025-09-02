import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../app/providers/ThemeProvider'


export default function ThemeToggle() {
const { theme, setTheme } = useTheme()
const isDark = theme === 'dark'


return (
<button

onClick={() => setTheme(isDark ? 'light' : 'dark')}
aria-label="Alternar tema"
>
{isDark ? <Sun size={16} /> : <Moon size={16} />}
<span>{isDark ? 'Claro' : 'Escuro'}</span>
</button>
)
}