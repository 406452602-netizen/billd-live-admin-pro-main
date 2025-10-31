import { IForm } from '@/components/Base/Form';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, IQuizPayoutsStatistics, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (
  t,
  userIdClick,
  memberIdClick
): IForm<ISearch<IQuizPayoutsStatistics>> => {
  return {
    gridSpan: 8,
    labelPlacement: 'left',
    formStyle: {
      justifyContent: 'center',
    },
    formItems: [
      {
        field: 'parent_user_id',
        type: FormTypeEnum.number,
        label: '上级用户id',
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
      ...useOrder({
        columnsConfig: columnsConfig(t, userIdClick, memberIdClick),
        t,
      }),
    ],
  };
};
