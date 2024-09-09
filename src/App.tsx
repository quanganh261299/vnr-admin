import { FC } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { route } from "./routes/route";

const App: FC = () => {
  const router = createBrowserRouter(route);

  return (
    <RouterProvider router={router} />
  )
}

export default App
