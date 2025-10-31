import { IForm } from '@/components/Base/Form';
import { blacklistTypeEnumMap } from '@/constant';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, IBlacklist, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<IBlacklist>> => {
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
        field: 'type',
        type: FormTypeEnum.select,
        label: '黑名单类型',
        options: Object.keys(blacklistTypeEnumMap).map((v) => {
          return { label: blacklistTypeEnumMap[v], value: v };
        }),
      },
      {
        field: 'keyWord',
        type: FormTypeEnum.input,
        label: '关键字',
        placeholder: '商品名称/介绍/标记/备注',
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
