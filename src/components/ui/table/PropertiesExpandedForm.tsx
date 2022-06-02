import { ReapitConnectSession } from '@reapit/connect-session'
import { Button, ButtonGroup, FormLayout, InputGroup, InputWrap, Molecule, Subtitle, useSnack } from '@reapit/elements'
import { PropertyModel } from '@reapit/foundations-ts-definitions'
import React from 'react'
import { updatePropertiesApiService } from '../../../platform-api/properties-api'

function PropertiesExpandedForm({
  id,
  address,
  expandedFormIndexSetter,
  _eTag,
  dataRefetcher,
  connectSession,
}: {
  id?: string
  address?: PropertyModel['address'],
  // buildingNumber?: string
  // buildingName?: string
  _eTag?: string
  expandedFormIndexSetter: React.Dispatch<React.SetStateAction<number | null>>
  dataRefetcher: () => Promise<void>
  connectSession: ReapitConnectSession | null
}) {
  const { info } = useSnack()

  const hideExpandedForm = () => {
    expandedFormIndexSetter(null)
  }

  const onUpdateSubmit = (e) => {
    e.preventDefault()
    const formData: FormData = new FormData(e.target as HTMLFormElement)
    const newBuildingNumber: string = formData.get('buildingNumber')?.toString() ?? ''
    const newBuildingName: string = formData.get('buildingName')?.toString() ?? ''
    const newLine1: string = formData.get('line1')?.toString() ?? ''
    const newLine2: string = formData.get('line2')?.toString() ?? ''
    if (!id || !_eTag) {
      alert('this item does not have an ID or eTag')
      return
    }
    updatePropertiesApiService(
      connectSession,
      id,
      {
        address: {
          ...address,
          buildingNumber: newBuildingNumber,
          buildingName: newBuildingName,
          line1: newLine1,
          line2: newLine2,
        }
      },
      _eTag,
    ).then((result) => {
      if (result) {
        hideExpandedForm()
        dataRefetcher()
        info('data updated successfully')
      }
    })
  }
  return (
    <form method="POST" onSubmit={onUpdateSubmit}>
      <Molecule>
        <Subtitle>Update Properties</Subtitle>
        <FormLayout>
          <InputWrap>
            <InputGroup name="buildingName" label="Building Name" type="text" defaultValue={address?.buildingName} />
          </InputWrap>
          <InputWrap>
            <InputGroup name="buildingNumber" label="Building Number" type="text" defaultValue={address?.buildingNumber} />
          </InputWrap>
          <InputWrap>
            <InputGroup name="line1" label="Address Line 1" type="text" defaultValue={address?.line1} />
          </InputWrap>
          <InputWrap>
            <InputGroup name="line2" label="Address Line 1" type="text" defaultValue={address?.line2} />
          </InputWrap>
          <InputWrap />
          <InputWrap>
            <ButtonGroup>
              <Button chevronRight intent="primary">
                Submit
              </Button>
            </ButtonGroup>
          </InputWrap>
        </FormLayout>
      </Molecule>
    </form>
  )
}

export default PropertiesExpandedForm
