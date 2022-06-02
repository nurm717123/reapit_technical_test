import React, { useEffect, FC, useState } from 'react'
import {
  Title,
  Subtitle,
  Button,
  elHFull,
  elMb5,
  FlexContainer,
  Icon,
  PageContainer,
  SecondaryNavContainer,
  SmallText,
  Loader,
  Table,
} from '@reapit/elements'
import { useReapitConnect } from '@reapit/connect-session'
import { PropertyModelPagedResult } from '@reapit/foundations-ts-definitions'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { openNewPage } from '../../utils/navigation'
import { propertiesApiService } from '../../platform-api/properties-api'

export const DataPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [Properties, setProperties] = useState<PropertyModelPagedResult>({})

  const [loading, setLoading] = useState<boolean>(false)

  const refetchData = async () => {
    const fetchResult = await propertiesApiService(connectSession, {
      marketingMode: ['selling'],
    })

    if (fetchResult) {
      setProperties(fetchResult)
    }
  }

  useEffect(() => {
    const fetchAppoinmentConfigs = async () => {
      setLoading(true)

      await refetchData()

      setLoading(false)
    }

    if (connectSession) {
      fetchAppoinmentConfigs()
    }
  }, [connectSession])

  return (
    <FlexContainer isFlexAuto>
      <SecondaryNavContainer>
        <Title>Data</Title>
        <Icon className={elMb5} icon="webhooksInfographic" iconSize="large" />
        <Subtitle>Data Fetching</Subtitle>
        <SmallText hasGreyText>
          This simple example demonstrates how to fetch data from our Appointment Config service, authenticated with
          Reapit Connect using the Connect Session library. You can view the relevant docs below.
        </SmallText>
        <Button
          className={elMb5}
          intent="neutral"
          onClick={openNewPage('https://developers.reapit.cloud/api-docs/app-development/connect-session')}
        >
          Connect Session
        </Button>
        <Button
          className={elMb5}
          intent="neutral"
          onClick={openNewPage('https://developers.reapit.cloud/api-docs/api/api-documentation')}
        >
          REST API
        </Button>
      </SecondaryNavContainer>
      <PageContainer className={elHFull}>
        <Title>Properties for Sale</Title>
        {loading ? (
          <Loader label="loading" />
        ) : (
          <Table
            rows={Properties._embedded?.map(({ id, boardNotes, description, selling }) => ({
              cells: [
                {
                  label: 'Properties Id',
                  value: id?.length ? id : '-',
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Selling Agency',
                  value: selling?.agency,
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Selling Price',
                  value: selling?.price,
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Description',
                  value: description ?? '',
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Board Notes',
                  value: boardNotes ?? '',
                  narrowTable: {
                    showLabel: true,
                  },
                },
              ],
            }))}
          />
        )}
      </PageContainer>
    </FlexContainer>
  )
}

export default DataPage
