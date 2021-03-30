import React, { ReactElement, useState } from 'react'

import { useForm } from 'react-hook-form'
import { Box, Button, List } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { LabeledInput, LabeledCheckBox } from '../input'
import { TaxesState, Dependent, Person, PersonRole } from '../../redux/data'
import { addDependent, addSpouse, removeSpouse } from '../../redux/actions'
import { ListDependents, PersonFields, PersonListItem } from './PersonFields'
import FormContainer from './FormContainer'
import { PagerContext } from '../pager'

interface UserPersonForm {
  firstName: string
  lastName: string
  ssid: string
}

interface UserDependentForm extends UserPersonForm {
  relationship: string
  isQualifiedForChildTaxCredit: boolean
  isQualifiedForOtherDependentTaxCredit: boolean
}

const toDependent = (formData: UserDependentForm): Dependent => ({
  ...formData,
  role: PersonRole.DEPENDENT
})

const toSpouse = (formData: UserPersonForm): Person => ({
  ...formData,
  role: PersonRole.SPOUSE
})

export const AddDependentForm = (): ReactElement => {
  const { register, control, errors, handleSubmit, getValues, reset } = useForm<UserDependentForm>({ defaultValues: { isQualifiedForChildTaxCredit: false, isQualifiedForOtherDependentTaxCredit: false } })

  const [addingDependent, newDependent] = useState(false)

  const dispatch = useDispatch()

  const [isQualifiedForChildTaxCredit, updateQualifiedForChildTaxCredit] = useState(false)
  const [isQualifiedForOtherDependentTaxCredit, updateQualifiedForOtherDependentTaxCredit] = useState(false)

  const onSubmit = (): void => {
    dispatch(addDependent(toDependent(getValues())))
    newDependent(false)
    reset()
    // I tried to do this with reset() but couldn't get it to work.
    // But this works so the credit statuses don't carry over
    updateQualifiedForChildTaxCredit(false)
    updateQualifiedForOtherDependentTaxCredit(false)
  }

  if (addingDependent) {
    return (
      <FormContainer
        onDone={handleSubmit(onSubmit)}
        onCancel={() => newDependent(false)}
      >
        <PersonFields
          register={register}
          errors={errors}
        />
        <LabeledInput
          label="Relationship to taxpayer"
          register={register}
          name="relationship"
          patternConfig={Patterns.name}
          required={true}
          error={errors.relationship}
        />
        <LabeledCheckBox
          control={control}
          name="isQualifiedForChildTaxCredit"
          value={isQualifiedForChildTaxCredit}
          setValue={updateQualifiedForChildTaxCredit}
          label="Qualfies for Child Tax Credit"
        />
        <LabeledCheckBox
          name="isQualifiedForOtherDependentTaxCredit"
          control={control}
          value={isQualifiedForOtherDependentTaxCredit}
          setValue={updateQualifiedForOtherDependentTaxCredit}
          label="Qualfies for Credit for Other Dependents"
        />
      </FormContainer>
    )
  } else {
    return (
      <Box display="flex" justifyContent="flex-start">
        <Button type="button" onClick={() => newDependent(true)} variant="contained" color="secondary">
          Add
        </Button>
      </Box>
    )
  }
}

export const SpouseInfo = (): ReactElement => {
  const { register, errors, handleSubmit, getValues } = useForm<UserPersonForm>()
  const [editSpouse, updateEditSpouse] = useState(false)
  const dispatch = useDispatch()

  const spouse: Person | undefined = useSelector((state: TaxesState) => {
    return state.information.taxPayer?.spouse
  })

  const onSubmit = (): void => {
    updateEditSpouse(false)
    dispatch(addSpouse(toSpouse(getValues())))
  }

  if (editSpouse) {
    return (
      <FormContainer
        onDone={handleSubmit(onSubmit)}
        onCancel={() => updateEditSpouse(false)}
      >
        <PersonFields
          register={register}
          errors={errors}
        />
      </FormContainer>
    )
  } else if (spouse !== undefined) {
    return (
      <List dense={true}>
        <PersonListItem
          person={spouse}
          remove={() => dispatch(removeSpouse)}
        />
      </List>
    )
  } else {
    return (
      <Box display="flex" flexDirection="flex-start">
        <Button type="button" onClick={() => updateEditSpouse(true)} variant="contained" color="secondary">
          Add
        </Button>
      </Box>
    )
  }
}

const SpouseAndDependent = (): ReactElement => (
  <PagerContext.Consumer>
    { ({ onAdvance, navButtons }) =>
      <Box display="flex" justifyContent="center">
        <form onSubmit={onAdvance}>
          <Box display="flex" justifyContent="flex-start">
            <h2>Spouse Information</h2>
          </Box>
          <SpouseInfo />
          <Box display="flex" justifyContent="flex-start">
            <h2>Dependent Information</h2>
          </Box>
          <ListDependents />
          <AddDependentForm />
          {navButtons}
        </form>
      </Box>
    }
  </PagerContext.Consumer>
)

export default SpouseAndDependent
