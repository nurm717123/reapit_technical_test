import { ReapitConnectSession } from '@reapit/connect-session'
import { Properties, PropertyModelPagedResult } from '@reapit/foundations-ts-definitions'
import { BASE_HEADERS, URLS } from '../constants/api'

export const propertiesApiService = async (
  session: ReapitConnectSession | null,
  params: Properties | undefined = undefined,
): Promise<PropertyModelPagedResult | undefined> => {
  try {
    if (!session) return

    let routeParams: string = ''

    if (params) {
      for (const paramKey in params) {
        const paramValue: String = params[paramKey].toString()
        routeParams += `${paramKey}=${paramValue}&`
      }
    }

    const response = await fetch(
      `${window.reapit.config.platformApiUrl}${URLS.PROPERTIES_LISTS_TYPES}?${routeParams}`,
      {
        method: 'GET',
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${session?.accessToken}`,
        },
      },
    )

    if (response.ok) {
      const responseJson: Promise<PropertyModelPagedResult | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    const error = err as Error
    console.error('Error fetching PropertyModelPagedResult List Types', error.message)
  }
}

export const updatePropertiesApiService = async (
  session: ReapitConnectSession | null,
  id: string,
  body: any,
  eTag: string,
): Promise<boolean | undefined> => {
  try {
    if (!session) return

    const response = await fetch(`${window.reapit.config.platformApiUrl}${URLS.PROPERTIES_LISTS_TYPES}${id}`, {
      method: 'PATCH',
      headers: {
        ...BASE_HEADERS,
        'If-Match': eTag,
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      return true
    }

    throw new Error('No response returned by API')
  } catch (err) {
    const error = err as Error
    console.error('Error fetching PropertyModelPagedResult List Types', error.message)
  }
}
