import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getFirebaseApp } from './utils/firebase.js'

// Initialize the default Firebase app once at startup so features that rely on
// it (e.g. the checkout/payment modal) work on every page — including standalone
// landing pages that hide the navbar (which used to be what triggered init).
getFirebaseApp()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
