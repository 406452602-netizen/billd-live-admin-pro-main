import { IForm } from '@/components/Base/Form';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, IQuizVotes, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<IQuizVotes>> => {
  return {
    gridSpan: 8,
    labelPlacement: 'left',
    formStyle: {
      justifyContent: 'center',
    },
    formItems: [
      {
        field: 'vote_id',
        type: FormTypeEnum.input,
        label: 'id',
      },
      {
        field: 'user_id',
        type: FormTypeEnum.number,
        label: '用户id',
      },
      {
        field: 'rangTimeType',
        type: FormTypeEnum.datePickerRange,
        label: '时间范围',
      },
      ...useOrder({ columnsConfig: columnsConfig(t), t }),
    ],
  };
};
