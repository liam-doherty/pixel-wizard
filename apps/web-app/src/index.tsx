/* @refresh reload */
import { render } from 'solid-js/web'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()
const root = document.getElementById('root')

render(() => (
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
), root!)
