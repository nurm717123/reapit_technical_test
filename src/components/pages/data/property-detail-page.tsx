import { cx } from '@linaria/core'
import {
  BodyText,
  Col,
  elFlex,
  elFlexAlignCenter,
  elFlexAlignStart,
  elFlexColumn,
  elFlexColumnReverse,
  elFlexJustifyBetween,
  elFlexJustifyStart,
  elFlexRow,
  elM4,
  elMb4,
  elMb5,
  elMb6,
  elP4,
  elPb6,
  elTextCenter,
  elW11,
  elWFull,
  FlexContainer,
  Grid,
  Icon,
  Loader,
  Molecule,
  PageContainer,
  RowProps,
  SmallText,
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
    <PageContainer>
      {propertyQuery.isLoading && <Loader className={elM4} label="loading table data" />}
      {propertyQuery.isSuccess && (
        <FlexContainer
          className={cx(
            elP4,
            elPb6,
            elFlexColumn,
            elFlexJustifyStart,
            elFlexAlignStart,
            !isMobile && elFlexAlignCenter,
          )}
        >
          <div
            className={cx(
              elFlex,
              isMobile ? elFlexColumnReverse : elFlexRow,
              elFlexJustifyBetween,
              elFlexAlignStart,
              elWFull,
              elMb6,
            )}
          >
            <Molecule>
              <Title className={cx(elMb4, isMobile && elTextCenter)}>
                {propertyQuery.data.address?.buildingName ? propertyQuery.data.address?.buildingName : 'Unnamed'}
              </Title>
              <BodyText className={cx(isMobile ? elTextCenter : elW11)}>
                {propertyQuery.data.longDescription || propertyQuery.data.description || 'No description'}
              </BodyText>
            </Molecule>
            <MainImage src={PropertyPlaceholderImage} alt="Property image" className={cx(isMobile && elMb5)} />
          </div>
          <Table
            className={elWFull}
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
        </FlexContainer>
      )}
    </PageContainer>
  )
}

export default PropertyDetail
