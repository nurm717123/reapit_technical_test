import React, { FC } from 'react'
import Router from './router'
import ErrorBoundary from '../components/hocs/error-boundary'
import { MediaStateProvider, NavStateProvider, SnackProvider } from '@reapit/elements'
import '@reapit/elements/dist/index.css'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    // queries: {
    //   refetchOnMount: process.env.NODE_ENV === 'production',
    //   refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    // },
  },
})

const App: FC = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <NavStateProvider>
        <MediaStateProvider>
          <SnackProvider>
            <Router />
          </SnackProvider>
        </MediaStateProvider>
      </NavStateProvider>
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
