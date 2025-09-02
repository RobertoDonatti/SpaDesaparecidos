import { PropsWithChildren, useEffect, useState } from 'react'


const KEY = 'pp_theme'


type Theme = 'light' | 'dark'


export function ThemeProvider({ children }: PropsWithChildren) {
const [theme, setTheme] = useState<Theme>('dark')


useEffect(() => {
const saved = (localStorage.getItem(KEY) as Theme) || 'dark'
setTheme(saved)
}, [])


useEffect(() => {
const root = document.documentElement
if (theme === 'dark') root.classList.add('dark')
else root.classList.remove('dark')
localStorage.setItem(KEY, theme)
}, [theme])


return (
<ThemeContext.Provider value={{ theme, setTheme }}>
{children}
</ThemeContext.Provider>
)
}


import { createContext, Dispatch, SetStateAction, useContext } from 'react'


type Ctx = { theme: Theme; setTheme: Dispatch<SetStateAction<Theme>> }
const ThemeContext = createContext<Ctx>({ theme: 'dark', setTheme: () => {} })
export const useTheme = () => useContext(ThemeContext)