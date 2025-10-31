import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IAdCarousel } from '@/interface';

export const formConfig = (): IForm<IAdCarousel> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'ad_url',
        type: FormTypeEnum.input,
        label: '广告路由',
      },
      {
        field: 'ad_image',
        type: FormTypeEnum.upload,
        uploadConfig: {
          max: 1,
        },
        rule: { required: true, trigger: 'blur', type: 'any' },
        label: '广告图片',
      },
      {
        field: 'ad_remark',
        type: FormTypeEnum.input,
        label: '备注',
      },
    ],
  };
};
