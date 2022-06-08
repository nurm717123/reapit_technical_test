import { useReapitConnect } from '@reapit/connect-session'
import {
  Button,
  elHFull,
  elMb5,
  FlexContainer,
  Icon,
  Loader,
  PageContainer,
  SecondaryNavContainer,
  SmallText,
  Subtitle,
  Table,
  Title,
  PersistantNotification,
  Intent,
} from '@reapit/elements'
import { PropertyModelPagedResult } from '@reapit/foundations-ts-definitions'
import React, { FC, useEffect, useState } from 'react'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { propertiesApiService } from '../../platform-api/properties-api'
import { openNewPage } from '../../utils/navigation'
import PropertiesExpandedForm from '../ui/table/PropertiesExpandedForm'

enum persistantNotifIcon {
  info = 'infoSolidSystem',
  danger = 'errorSolidSystem',
  success = 'checkSystem',
}

export const DataPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  const [Properties, setProperties] = useState<PropertyModelPagedResult>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [indexExpandedRow, setIndexExpandedRow] = useState<number | null>(null)
  const [persistantNotifState, setPersistantNotifState] = useState<{
    intent: Intent
    message: string
    isExpanded: boolean
  }>({
    intent: 'secondary',
    message: 'you can edit each properties by click the expand button',
    isExpanded: false,
  })

  const setPersistantNotifExpanded = (isExpanded) => {
    setPersistantNotifState((state) => ({ ...state, isExpanded }))
  }

  const refetchData = async () => {
    setLoading(true)
    const fetchResult = await propertiesApiService(connectSession, {
      marketingMode: ['selling'],
    })

    setLoading(false)

    console.log(fetchResult)

    if (fetchResult) {
      setProperties(fetchResult)
    }
  }

  useEffect(() => {
    if (connectSession) {
      refetchData()
    }
  }, [connectSession])

  const propertiesUpdateCallback = async (isSuccess: boolean) => {
    if (isSuccess) {
      await refetchData()
    }
    setPersistantNotifState({
      intent: isSuccess ? 'success' : 'danger',
      isExpanded: true,
      message: isSuccess ? 'Data updated successfully' : 'Failed to update the data',
    })
  }

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
            indexExpandedRow={indexExpandedRow}
            setIndexExpandedRow={setIndexExpandedRow}
            rows={Properties._embedded?.map(({ id, address, selling, internalArea, rooms, _eTag }) => ({
              expandableContent: {
                icon: 'editSystem',
                content: (
                  <PropertiesExpandedForm
                    _eTag={_eTag}
                    address={address}
                    connectSession={connectSession}
                    callback={propertiesUpdateCallback}
                    expandedFormIndexSetter={setIndexExpandedRow}
                    id={id}
                  />
                ),
                headerContent: <Icon icon="editSystem" fontSize="1.2rem" />,
              },
              cells: [
                {
                  label: 'Properties Id',
                  value: id?.length ? id : '-',
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Building Name',
                  value: address?.buildingName ? address.buildingName : 'unspecified',
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Price',
                  value: selling?.price ?? '-',
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Address',
                  value: address
                    ? `${address.line1}, ${address.line2}, ${address.line3}, ${address.line4}`
                    : 'unspecified',
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Rooms',
                  value: rooms?.length ? rooms.length : 'unspecified',
                  narrowTable: {
                    showLabel: true,
                  },
                },
                {
                  label: 'Area',
                  value: internalArea
                    ? `${internalArea.min} to ${internalArea.max} ${internalArea.type}`
                    : 'unspecified',
                  narrowTable: {
                    showLabel: true,
                  },
                },
              ],
            }))}
          />
        )}
      </PageContainer>
      <PersistantNotification
        isExpanded={persistantNotifState.isExpanded}
        onExpansionToggle={setPersistantNotifExpanded}
        isFixed
        icon={persistantNotifIcon[persistantNotifState.intent]}
        intent={persistantNotifState.intent}
      >
        {persistantNotifState.message}
      </PersistantNotification>
    </FlexContainer>
  )
}

export default DataPage
