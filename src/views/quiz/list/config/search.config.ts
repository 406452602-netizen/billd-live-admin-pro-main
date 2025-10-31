import { IForm } from '@/components/Base/Form';
import { goodsTypeEnumMap } from '@/constant';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, IQuizMatches, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<IQuizMatches>> => {
  return {
    gridSpan: 8,
    labelPlacement: 'left',
    formStyle: {
      justifyContent: 'center',
    },
    formItems: [
      {
        field: 'team_id',
        type: FormTypeEnum.number,
        label: 'id',
      },
      {
        field: 'keyWord',
        type: FormTypeEnum.input,
        label: '关键字',
        placeholder: '赛季名称',
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
