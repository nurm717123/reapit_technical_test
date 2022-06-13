import React from 'react'
import { act, render, RenderResult } from '@testing-library/react'
import Router, { catchChunkError } from '../router'
import { MediaStateProvider, NavStateProvider } from '@reapit/elements'
import { Router as ReactRouter, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { QueryClient, QueryClientProvider } from 'react-query'

const history = createBrowserHistory()

jest.mock('@reapit/connect-session', () => ({
  ReapitConnectBrowserSession: jest.fn(),
  useReapitConnect: () => ({
    connectSession: {
      loginIdentity: {},
    },
    connectInternalRedirect: '',
  }),
}))

describe('Router', () => {
  it('should match a snapshot', async () => {
    let component: RenderResult

    const queryClient = new QueryClient({
      defaultOptions: {
        // queries: {
        //   refetchOnMount: process.env.NODE_ENV === 'production',
        //   refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        // },
      },
    })

    await act(() => {
      component = render(
        <QueryClientProvider client={queryClient}>
          <ReactRouter history={history}>
            <Switch>
              <NavStateProvider>
                <MediaStateProvider>
                  <Router />
                </MediaStateProvider>
              </NavStateProvider>
            </Switch>
          </ReactRouter>
        </QueryClientProvider>,
      )
    })

    act(() => {
      expect(component).toMatchSnapshot()
    })
  })

  describe('catchChunkError', () => {
    it('should return promise', (done) => {
      const fn = jest.fn().mockResolvedValue(<div>Test</div>)
      const promiseFn = catchChunkError(fn)
      expect(promiseFn).toBeDefined()
      expect(fn).toBeCalled()
      expect(
        promiseFn.then((result) => {
          expect(result).toEqual(<div>Test</div>)
          done()
        }),
      )
    })
  })
})
