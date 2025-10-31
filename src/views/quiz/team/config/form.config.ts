import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IQuizTeams } from '@/interface';

export const formConfig = ({
  quizTypeOption,
}: {
  quizTypeOption: { label: any; value: number }[];
}): IForm<IQuizTeams> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'team_name',
        type: FormTypeEnum.input,
        label: '队伍名称',
        rule: { required: true, trigger: 'blur' },
      },
      {
        field: 'type_id',
        type: FormTypeEnum.radio,
        options: quizTypeOption,
        label: '比赛类型',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'team_logo',
        type: FormTypeEnum.upload,
        uploadConfig: {
          max: 1,
        },
        label: 'logo',
      },
    ],
  };
};
