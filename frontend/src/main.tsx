import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import AppWithDatabase from './AppWithDatabase.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithDatabase />
  </StrictMode>,
)
