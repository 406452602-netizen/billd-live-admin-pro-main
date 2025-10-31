import { IForm } from '@/components/Base/Form';
import {
  ClientAppMap,
  ClientEnvMap,
  msgContentTypeMap,
  msgTypeMap,
} from '@/constant';
import { useOrder } from '@/hooks/use-order';
import { FormTypeEnum, IMsg, ISearch } from '@/interface';

import { columnsConfig } from './columns.config';

export const searchFormConfig = (t): IForm<ISearch<IMsg>> => {
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
        field: 'live_record_id',
        type: FormTypeEnum.number,
        label: '直播记录id',
      },
      {
        field: 'msg_type',
        type: FormTypeEnum.select,
        label: '消息类型',
        options: Object.keys(msgTypeMap).map((v) => {
          return {
            label: msgTypeMap[v],
            value: v,
          };
        }),
      },
      {
        field: 'content_type',
        type: FormTypeEnum.select,
        label: '内容类型',
        options: Object.keys(msgContentTypeMap).map((v) => {
          return {
            label: msgContentTypeMap[v],
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
        placeholder: '直播间标题/简介/ip/客户端版本/备注',
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
