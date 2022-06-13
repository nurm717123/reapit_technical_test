import React from 'react'
import { render } from '@testing-library/react'
import DataPage from '../data/data-page'
import { QueryClient, QueryClientProvider } from 'react-query'

describe('DataPage', () => {
  it('should match a snapshot', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        // queries: {
        //   refetchOnMount: process.env.NODE_ENV === 'production',
        //   refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        // },
      },
    })
    expect(
      render(
        <QueryClientProvider client={queryClient}>
          <DataPage />
        </QueryClientProvider>,
      ),
    ).toMatchSnapshot()
  })
})
