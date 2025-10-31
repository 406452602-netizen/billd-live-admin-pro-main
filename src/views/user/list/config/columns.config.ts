import { NButton } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { h } from 'vue';

import { IUser, UserStatusEnum } from '@/interface';

// eslint-disable-next-line
export const columnsConfig = (
  _t,
  handleUserIdClick?: (userId: number) => void
): TableColumns<IUser> => {
  return [
    {
      title: 'id',
      key: 'id',
      align: 'center',
      width: 100,
      fixed: 'left',
      render(row) {
        // 如果是代理商，则显示可点击的ID
        if (row.is_agent && handleUserIdClick) {
          return h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              text: true,
              onClick: () => {
                if (row.id !== undefined) {
                  handleUserIdClick!(row.id);
                }
              },
            },
            { default: () => row.id }
          );
        }
        // 普通会员显示普通ID
        return row.id;
      },
    },
    {
      title: '用户名',
      key: 'username',
      align: 'center',
      width: 120,
    },
    {
      title: '头像',
      key: 'avatar',
      align: 'center',
      render(row) {
        return h('img', {
          src: row.avatar,
          width: 150,
        });
      },
      width: 150,
    },
    {
      title: '身份',
      align: 'center',
      key: 'is_admin',
      width: 100,
      render(row) {
        if (row.is_admin) {
          return '管理员';
        } else if (row.is_agent) {
          return '代理商';
        } else {
          return '会员';
        }
      },
    },
    {
      title: '简介',
      key: 'desc',
      align: 'center',
      ellipsis: {
        tooltip: true,
      },
      width: 150,
    },
    {
      title: '余额',
      key: 'wallet.balance',
      align: 'center',
      width: 100,
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      render(row) {
        return row.status === UserStatusEnum.normal ? '正常' : '禁用';
      },
      width: 100,
    },
    {
      title: '创建时间',
      key: 'created_at',
      align: 'center',
      width: 200,
      fixed: 'right',
    },
    {
      title: '最后更新',
      key: 'updated_at',
      align: 'center',
      width: 200,
      fixed: 'right',
    },
  ];
};
