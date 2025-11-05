import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { routes } from './config/route'
import { store } from './config/store'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from '@/common/components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
      <Toaster position="top-right" richColors />
    </Provider>
  </StrictMode>,
)
