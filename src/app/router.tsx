import { RouteObject, useRoutes } from 'react-router-dom'
import Home from '../features/people/pages/Home.tsx'
import PersonDetails from '../features/people/pages/DetalhePessoa'


const routes: RouteObject[] = [
{ path: '/', element: <Home /> },
{ path: '/pessoa/:id', element: <PersonDetails /> },
]


export function AppRoutes() {
return useRoutes(routes)
}