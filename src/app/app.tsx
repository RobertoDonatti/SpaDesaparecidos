import Header from '../components/Header'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from '@/components/Footer'

const queryClient = new QueryClient()

export default function App() {
	return (
			<QueryClientProvider client={queryClient}>
				<div>
					<Header />
					<main>
						<RouterProvider router={router} />
					</main>
					<Footer />
				</div>
			</QueryClientProvider>
	);
}

// function App() {
//     return (
//         <>
//         <Header />
//         <Home />
//         <Footer />
//         </>
//     );
// }

// export default App