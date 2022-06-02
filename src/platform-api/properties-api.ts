import { ReapitConnectSession } from '@reapit/connect-session'
import { Properties, PropertyModelPagedResult, PropertyModel } from '@reapit/foundations-ts-definitions'
import { URLS, BASE_HEADERS } from '../constants/api'

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