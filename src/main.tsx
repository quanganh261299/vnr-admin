import { createRoot } from 'react-dom/client'
import './reset.scss'
import './global.scss'
import App from './App'
import './locales/i18n';


createRoot(document.getElementById('root')!).render(
  <App />
)
