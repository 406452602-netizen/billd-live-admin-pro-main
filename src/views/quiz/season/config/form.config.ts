import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IQuizSeasons } from '@/interface';

export const formConfig = ({
  quizTypeOption,
  quizTeamsOption,
}: {
  quizTypeOption: { label: any; value: number }[];
  quizTeamsOption: { label: any; value: number }[];
}): IForm<IQuizSeasons> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'season_name',
        type: FormTypeEnum.input,
        label: '赛季名称',
        rule: { required: true, trigger: 'blur' },
      },
      {
        field: 'quiz_match_type',
        type: FormTypeEnum.radio,
        options: quizTypeOption,
        label: '比赛类型',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'contest_teams',
        type: FormTypeEnum.checkbox,
        label: '参赛队伍',
        options: quizTeamsOption,
        rule: [
          {
            trigger: 'change',
            type: 'any',
            validator: (rule, value) => {
              console.log(rule, value);
              setTimeout(() => {
                if (value && value.length < 2) {
                  return new Error('最少选择两个队伍');
                }
              }, 100);
              return true;
            },
          },
        ],
      },
      {
        field: 'rangTime',
        type: FormTypeEnum.datePickerRange,
        label: '时间范围',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'season_logo',
        type: FormTypeEnum.upload,
        uploadConfig: {
          max: 1,
        },
        label: 'logo',
      },
    ],
  };
};
