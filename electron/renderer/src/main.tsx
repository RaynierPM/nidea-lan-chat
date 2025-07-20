import {createRoot} from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { StrictMode } from 'react'

createRoot(document.querySelector('#root')!)
.render(
  <StrictMode>  
    <RouterProvider router={router} />
  </StrictMode>
)