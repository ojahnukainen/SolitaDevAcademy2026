import { Provider } from "@/components/ui/provider"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import {
  QueryClientProvider,
  QueryClient
} from '@tanstack/react-query'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)