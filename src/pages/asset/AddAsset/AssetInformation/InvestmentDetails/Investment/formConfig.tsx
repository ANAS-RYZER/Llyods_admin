

import { FormFieldConfig } from '@/components/UseForm/ControllerMap';
import { FieldValues, useFormContext } from 'react-hook-form';

export const formConfig = (): FormFieldConfig[] => {
  const { control  , watch} = useFormContext();
  const totalPropertyValue = watch('totalPropertyValueAfterFees');
  return [
    {
      type: 'number',
      name: 'investmentPerformance.targetCapitalAppreciation',
      control,
      label: 'Annual Target Capital Appreciation',
      placeholder: 'Enter Target Capital Appreciation',
    },
    {
      type: 'number',
      name: 'investmentPerformance.estimatedReturnsAsPerLockInPeriod',
      control,
      label: 'Holding Period (years)',
      placeholder: 'Enter Number of Years',
    },
    {
      type: 'number',
      name: 'investmentPerformance.interestRateonReserves',
      control,
      label: 'Interest Rate on Reserves (%)',
      placeholder: 'Enter the intersest rate',
    },
  
  ];
};
