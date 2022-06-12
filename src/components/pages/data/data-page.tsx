import { cx } from '@linaria/core'
import { useReapitConnect } from '@reapit/connect-session'
import {
  Button,
  elFlex,
  elFlexAlignSelfCenter,
  elFlexColumn,
  elHFull,
  elMb5,
  elPt5,
  FlexContainer,
  Icon,
  Intent,
  Loader,
  PageContainer,
  Pagination,
  PersistentNotification,
  SecondaryNavContainer,
  SmallText,
  Subtitle,
  Table,
  Title,
} from '@reapit/elements'
import { Properties } from '@reapit/foundations-ts-definitions'
import React, { FC, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { propertiesApiService } from '../../../platform-api/properties-api'
import { openNewPage } from '../../../utils/navigation'
import { FilterInput, FilterSelect, FilterWrapper } from '../../ui/inputs/InputFilters'
import PropertiesExpandedForm from '../../ui/table/PropertiesExpandedForm'

enum persistantNotifIcon {
  info = 'infoSolidSystem',
  danger = 'errorSolidSystem',
  success = 'checkSystem',
}

const recentlyAddedDaysBefore = 5
const filterOptions = ['Unfiltered', `Recently Added (in ${recentlyAddedDaysBefore} days)`] as const

enum propertyTypes {
  all = 'All',
  house = 'House',
  bungalow = 'Bungalow',
  flatApartment = 'Flat Apartment',
  maisonette = 'Maisonette',
  land = 'Land',
  farm = 'Farm',
  cottage = 'Cottage',
  studio = 'Studio',
  townhouse = 'Townhouse',
  developmentPlot = 'Development Plot',
}

const propertyFilterComponentData = Object.keys(propertyTypes).map((propertyType) => ({
  key: propertyType,
  value: propertyTypes[propertyType],
}))

const filterOptionsComponentData = filterOptions.map((f) => ({ key: f, value: f }))

export const DataPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
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
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [filter, setFilter] = useState<Properties>({})
  const qc = useQueryClient()

  const setPersistantNotifExpanded = (isExpanded) => {
    setPersistantNotifState((state) => ({ ...state, isExpanded }))
  }

  const propertiesFetcher = (additionalPage: number = 0) =>
    propertiesApiService({
      pageNumber: currentPage + additionalPage,
      marketingMode: ['selling'],
      pageSize: 5,
      ...filter,
    })

  const propertiesQuery = useQuery(['properties', currentPage], () => propertiesFetcher(), {
    keepPreviousData: true,
    staleTime: 5000,
  })

  // Prefetch the next page!
  useEffect(() => {
    if (
      propertiesQuery.data?.pageNumber !== undefined &&
      propertiesQuery.data?.totalPageCount !== undefined &&
      propertiesQuery.data.pageNumber < propertiesQuery.data.totalPageCount
    ) {
      qc.prefetchQuery(['projects', currentPage + 1], () => propertiesFetcher(1))
    }
  }, [propertiesQuery.data, currentPage, qc])

  React.useEffect(() => {
    setCurrentPage(0)
    qc.invalidateQueries(['properties']).then(() => {
      propertiesQuery.refetch()
    })
  }, [filter])

  const propertiesUpdateCallback = async (isSuccess: boolean) => {
    if (isSuccess) {
      await propertiesQuery.refetch()
    }
    setPersistantNotifState({
      intent: isSuccess ? 'success' : 'danger',
      isExpanded: true,
      message: isSuccess ? 'Data updated successfully' : 'Failed to update the data',
    })
  }

  const onPropertyTypeChange = (e: React.ChangeEvent) => {
    const value: keyof typeof propertyTypes = (e.target as HTMLFormElement).value
    setFilter((state) => ({ ...state, type: value === 'all' ? undefined : [value] }))
  }

  const onChooseRecentlyAdded = (e: React.ChangeEvent) => {
    const value: typeof filterOptions[number] = (e.target as HTMLFormElement).value

    let createdFrom: Date | undefined
    if (value === `Recently Added (in ${recentlyAddedDaysBefore} days)`) {
      createdFrom = new Date()
      createdFrom.setDate(createdFrom.getDate() - recentlyAddedDaysBefore)
    }

    setFilter((state) => ({ ...state, createdFrom: createdFrom?.toISOString() }))
  }

  const onPriceToChange = (e: React.ChangeEvent) => {
    const value: Properties['priceTo'] = (e.target as HTMLFormElement).value

    setFilter((state) => ({ ...state, priceTo: value }))
  }

  const onPriceFromToChange = (e: React.ChangeEvent) => {
    const value: Properties['priceFrom'] = (e.target as HTMLFormElement).value

    setFilter((state) => ({ ...state, priceFrom: value }))
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
        {propertiesQuery.isLoading ? (
          <Loader label="loading" />
        ) : (
          <div className={cx(elFlex, elFlexColumn)}>
            <FilterWrapper>
              <FilterSelect filters={propertyFilterComponentData} onChange={onPropertyTypeChange} />
              <FilterSelect filters={filterOptionsComponentData} onChange={onChooseRecentlyAdded} />
            </FilterWrapper>
            <FilterWrapper>
              <FilterInput
                type="number"
                placeholder="Price from"
                onChange={onPriceFromToChange}
                iconName="dollarSystem"
              />
              <FilterInput type="number" placeholder="Price to" onChange={onPriceToChange} iconName="dollarSystem" />
            </FilterWrapper>
            <Table
              indexExpandedRow={indexExpandedRow}
              setIndexExpandedRow={setIndexExpandedRow}
              rows={propertiesQuery.data?._embedded?.map(({ id, address, selling, internalArea, rooms, _eTag }) => ({
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
            <div className={cx(elFlexAlignSelfCenter, elPt5)}>
              <Pagination
                callback={setCurrentPage}
                currentPage={currentPage ? currentPage : 1}
                numberPages={propertiesQuery.data?.totalPageCount ?? 1}
              />
            </div>
          </div>
        )}
      </PageContainer>
      <PersistentNotification
        isExpanded={persistantNotifState.isExpanded}
        onExpansionToggle={setPersistantNotifExpanded}
        isFixed
        icon={persistantNotifIcon[persistantNotifState.intent]}
        intent={persistantNotifState.intent}
      >
        {persistantNotifState.message}
      </PersistentNotification>
    </FlexContainer>
  )
}

export default DataPage
