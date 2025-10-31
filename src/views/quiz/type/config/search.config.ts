import { IForm } from '@/components/Base/Form';
import { goodsTypeEnumMap } from '@/constant';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, IQuizMatchTypes, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<IQuizMatchTypes>> => {
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
        field: 'type_name',
        type: FormTypeEnum.input,
        label: '商品类型',
        options: Object.keys(goodsTypeEnumMap).map((v) => {
          return { label: goodsTypeEnumMap[v], value: v };
        }),
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
