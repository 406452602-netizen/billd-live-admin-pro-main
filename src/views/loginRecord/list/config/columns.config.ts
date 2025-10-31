import { TableColumns } from 'naive-ui/es/data-table/src/interface';

import { ClientAppMap, ClientEnvMap, LoginRecordEnumMap } from '@/constant';
import { ILoginRecord } from '@/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<ILoginRecord> => {
  return [
    {
      title: 'id',
      key: 'id',
      align: 'center',
      width: 150,
    },
    {
      title: '用户id',
      key: 'user_id',
      align: 'center',
      width: 150,
    },
    {
      title: '用户名',
      key: 'user_username',
      align: 'center',
      width: 200,
      render(row) {
        return row.user?.username;
      },
    },
    {
      title: '类型',
      key: 'type',
      align: 'center',
      width: 200,
      render(row) {
        return LoginRecordEnumMap[row.type!];
      },
    },
    {
      title: 'ip',
      key: 'client_ip',
      align: 'center',
      width: 200,
    },
    {
      title: '客户端环境',
      key: 'client_env',
      align: 'center',
      width: 200,
      render(row) {
        return ClientEnvMap[row.client_env!];
      },
    },
    {
      title: '客户端app',
      key: 'client_app',
      align: 'center',
      width: 200,
      render(row) {
        return ClientAppMap[row.client_app!];
      },
    },
    {
      title: '客户端app版本',
      key: 'client_app_version',
      align: 'center',
      width: 200,
    },
    {
      title: '备注',
      key: 'remark',
      align: 'center',
      width: 200,
    },
    {
      title: '创建时间',
      key: 'created_at',
      align: 'center',
      width: 180,
      fixed: 'right',
    },
    {
      title: '最后更新',
      key: 'updated_at',
      align: 'center',
      width: 180,
      fixed: 'right',
    },
  ];
};
