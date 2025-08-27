

import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export const daoFormConfig = () => {
  const { control , watch } = useFormContext<any>();
  const spVName = watch('name');
  console.log(spVName);

  return [
  
    {
      label: 'DAO Name',
      name: `daoConfiguration.daoName`,
      type: 'text',
      fullWidth: false,
      control,
      rules: {
        required: 'DAO Name is required',
        maxLength: {
          value: 50,
          message: 'DAO Name cannot exceed 50 characters',
        },
      },
      defaultValue: spVName,
      
    },
    
  ];
};
