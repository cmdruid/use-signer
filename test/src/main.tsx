import React    from 'react'
import ReactDOM from 'react-dom/client'
import App      from './App.js'

import './styles/tacit.css'
import './styles/global.css'

import { SignerProvider } from '@/context/signer'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SignerProvider>
      <App />
    </SignerProvider>
  </React.StrictMode>
)
