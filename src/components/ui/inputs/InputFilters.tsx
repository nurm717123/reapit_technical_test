import { cx } from '@linaria/core'
import {
  elFlex1,
  elFlexJustifyBetween,
  elFlexRow,
  elMb5,
  FlexContainer,
  Icon,
  IconProps,
  Input,
  InputGroup,
  Select,
  useMediaQuery,
} from '@reapit/elements'
import React from 'react'

export const FilterWrapper = ({ children }: { children: React.ReactNode }) => (
  <FlexContainer className={cx(elMb5, elFlexJustifyBetween, elFlexRow)} isFlexAuto>
    {children}
  </FlexContainer>
)

type TFilterData = { key: string; value: string }

export const FilterSelect = ({ filters, onChange }: { filters: TFilterData[]; onChange: React.ChangeEventHandler }) => {
  return (
    <Select className={elFlex1} onChange={onChange}>
      {filters.map((f) => (
        <option value={f.value} key={f.key}>
          {f.value}
        </option>
      ))}
    </Select>
  )
}

interface IFilterInput extends React.InputHTMLAttributes<HTMLInputElement> {
  iconName: IconProps['icon']
}

export const FilterInput = ({ iconName, ...props }: IFilterInput) => {
  const { isMobile } = useMediaQuery()

  return (
    <InputGroup className={elFlex1}>
      <Input {...props} />
      {!isMobile && <Icon icon={iconName} />}
    </InputGroup>
  )
}
