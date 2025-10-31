import { h } from 'vue';

import { IAdCarousel } from '@/interface';
import { getBaseUrl } from '@/utils/request';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

const url = getBaseUrl();

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IAdCarousel> => {
  return [
    {
      title: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '广告图片',
      key: 'ad_image',
      align: 'center',
      render(row) {
        return h('img', {
          src: `${url}${row.ad_image}`,
          width: 150,
        });
      },
      width: 150,
    },
    {
      title: '广告链接',
      key: 'ad_url',
      align: 'center',
    },
    {
      title: '备注',
      key: 'ad_remark',
      width: 200,
    },
  ];
};
