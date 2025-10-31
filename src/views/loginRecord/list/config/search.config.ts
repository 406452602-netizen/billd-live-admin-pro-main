import { IForm } from '@/components/Base/Form';
import { ClientAppMap, ClientEnvMap, LoginRecordEnumMap } from '@/constant';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, ILoginRecord, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<ILoginRecord>> => {
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
        field: 'user_id',
        type: FormTypeEnum.number,
        label: '用户id',
      },
      {
        field: 'type',
        type: FormTypeEnum.select,
        label: '类型',
        options: Object.keys(LoginRecordEnumMap).map((v) => {
          return {
            label: LoginRecordEnumMap[v],
            value: v,
          };
        }),
      },
      {
        field: 'client_env',
        type: FormTypeEnum.select,
        label: '客户端环境',
        options: Object.keys(ClientEnvMap).map((v) => {
          return {
            label: ClientEnvMap[v],
            value: v,
          };
        }),
      },
      {
        field: 'client_app',
        type: FormTypeEnum.select,
        label: '客户端app',
        options: Object.keys(ClientAppMap).map((v) => {
          return {
            label: ClientAppMap[v],
            value: v,
          };
        }),
      },
      {
        field: 'keyWord',
        type: FormTypeEnum.input,
        label: '关键字',
        placeholder: 'ip/客户端app版本/备注',
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
