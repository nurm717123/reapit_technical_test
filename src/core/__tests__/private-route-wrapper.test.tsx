import React from 'react'
import { render } from '@testing-library/react'
import { PrivateRouteWrapper } from '../private-route-wrapper'
import { MediaStateProvider, NavStateProvider } from '@reapit/elements'
import { Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { QueryClient, QueryClientProvider } from 'react-query'

jest.mock('../../components/ui/nav/nav', () => ({ Nav: () => <div /> }))

const history = createBrowserHistory()

describe('PrivateRouter', () => {
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
          <Router history={history}>
            <Switch>
              <NavStateProvider>
                <MediaStateProvider>
                  <PrivateRouteWrapper>
                    <div />
                  </PrivateRouteWrapper>
                </MediaStateProvider>
              </NavStateProvider>
            </Switch>
          </Router>
        </QueryClientProvider>,
      ),
    ).toMatchSnapshot()
  })
})
