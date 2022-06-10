import {
  BodyText,
  Col,
  elMb4,
  elP4,
  elPb6,
  elW11,
  Grid,
  Icon,
  Loader,
  RowProps,
  SmallText,
  Subtitle,
  Table,
  Title,
  useMediaQuery,
} from '@reapit/elements'
import { PropertyModel, PropertyModelPagedResult } from '@reapit/foundations-ts-definitions'
import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router'
import PropertyPlaceholderImage from '../../../assets/images/house.png'
import { propertiesApiDetailService } from '../../../platform-api/properties-api'
import { MainImage } from './__styles__/property-detail.style'

function PropertyDetail() {
  const { propertyId } = useParams<{ propertyId: string }>()

  const propertiesFetcher = () => propertiesApiDetailService(propertyId)

  const propertyQuery = useQuery<PropertyModel, Error>(['propertyById', propertyId], () => propertiesFetcher(), {
    staleTime: 5000,
    enabled: false,
  })

  const { isMobile } = useMediaQuery()

  const qc = useQueryClient()

  React.useEffect(() => {
    if (propertyId) {
      let hasCache: boolean = false
      const queryData = qc.getQueryData<PropertyModel>(['propertyById', propertyId])

      if (queryData) {
        qc.setQueriesData(['propertyById', propertyId], () => queryData)
        hasCache = true
      } else {
        const pagedQueryData = qc.getQueriesData<PropertyModelPagedResult>(['properties'])

        hasCache = pagedQueryData.some((queryData) => {
          const queryKey = queryData[0]
          if (queryKey[0] === 'properties') {
            const loadedData = (queryData[1] as PropertyModelPagedResult)._embedded?.find((p) => p.id === propertyId)

            if (loadedData) {
              qc.setQueriesData(['propertyById', propertyId], () => loadedData)
              return true
            }
          }
        })
      }

      if (!hasCache) {
        propertyQuery.refetch()
      }
    }
  }, [propertyId])

  return (
    <div>
      {propertyQuery.isLoading && <Loader label="loading" />}
      {propertyQuery.isSuccess && (
        <div>
          <MainImage src={PropertyPlaceholderImage} alt="" />
          <div className={`${elP4} ${elPb6}`}>
            <Title className={`${elMb4}`}>{propertyQuery.data.address?.buildingName ?? 'Unnamed'}</Title>
            <Subtitle>
              {propertyQuery.data.longDescription || propertyQuery.data.description || 'No description'}
            </Subtitle>
            <Table
              className={elW11}
              indexExpandedRow={isMobile ? null : 0}
              rows={[propertyQuery.data].map(
                ({ id, address, selling, internalArea, externalArea, rooms, currency, bedrooms, bathrooms }) => {
                  const addressLines = [address?.line1, address?.line2, address?.line3, address?.line4]
                    .filter((a) => !!a)
                    .join(', ')

                  const displayedCells: RowProps['cells'] = [
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
                      label: 'Bedrooms',
                      value: bedrooms ?? 0,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Bathrooms',
                      value: bathrooms ?? 0,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: `Price (${currency})`,
                      value: selling?.price ?? '-',
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Address',
                      value: addressLines ? addressLines : 'unspecified',
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
                      label: 'Internal Area size',
                      value: internalArea
                        ? `${internalArea.min} to ${internalArea.max} ${internalArea.type}`
                        : 'unspecified',
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'External Area size',
                      value: externalArea
                        ? `${externalArea.min} to ${externalArea.max} ${externalArea.type}`
                        : 'unspecified',
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                  ]
                  const rowData: RowProps = {
                    cells: displayedCells,
                  }

                  if (!isMobile) {
                    const cuttedColumns = rowData.cells.splice(-4)
                    rowData.expandableContent = {
                      icon: 'moreSystem',
                      content: (
                        <Grid>
                          {cuttedColumns.map((column) => {
                            return (
                              <Col key={column.label}>
                                <BodyText>{column.label}</BodyText>
                                <SmallText hasBoldText>{column.value}</SmallText>
                              </Col>
                            )
                          })}
                        </Grid>
                      ),
                      headerContent: <Icon icon="moreSystem" fontSize="1.2rem" />,
                    }
                  }

                  return rowData
                },
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail
