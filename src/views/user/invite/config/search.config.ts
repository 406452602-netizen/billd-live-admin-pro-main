import { IForm } from '@/components/Base/Form';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, IInviteAgent, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<IInviteAgent>> => {
  return {
    gridSpan: 8,
    labelPlacement: 'left',
    formStyle: {
      justifyContent: 'center',
    },
    formItems: [
      {
        field: 'invite_code',
        type: FormTypeEnum.number,
        label: '邀请码',
      },
      {
        field: 'is_valid',
        type: FormTypeEnum.switch,
        label: '只显示有效',
      },
      {
        field: 'keyWord',
        type: FormTypeEnum.input,
        label: '关键字',
        placeholder: '用户名/简介',
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
