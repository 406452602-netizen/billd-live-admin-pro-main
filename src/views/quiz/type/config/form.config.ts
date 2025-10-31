import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IQuizMatchTypes } from '@/interface';

export const formConfig = (): IForm<IQuizMatchTypes> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'type_name',
        type: FormTypeEnum.input,
        label: '比赛类型名称',
        rule: { required: true, trigger: 'blur' },
      },
    ],
  };
};
