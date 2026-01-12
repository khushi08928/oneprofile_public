import { Toaster } from "@/components/ui/sonner";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import './App.css';
import { routeTree } from "./routes";

const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
