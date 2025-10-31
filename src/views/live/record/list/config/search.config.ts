import { IForm } from '@/components/Base/Form';
import { ClientAppMap, ClientEnvMap } from '@/constant';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, ILiveRecord, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<ILiveRecord>> => {
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
        field: 'live_room_id',
        type: FormTypeEnum.number,
        label: '直播间id',
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
