import { IForm } from '@/components/Base/Form';
import { useOrder } from '@/hooks/use-order.ts';
import { FormTypeEnum, IRechargeRecord, ISearch } from '@/interface.ts';
import { columnsConfig } from '@/views/wallet/rechargeRecord/config/columns.config.ts';

export const searchFormConfig = (t): IForm<ISearch<IRechargeRecord>> => {
  return {
    gridSpan: 8,
    labelPlacement: 'left',
    formStyle: {
      justifyContent: 'center',
    },
    formItems: [
      {
        field: 'id',
        type: FormTypeEnum.number,
        label: 'id',
      },
      {
        field: 'keyWord',
        type: FormTypeEnum.input,
        label: '关键字',
        placeholder: '银行',
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
