import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IQuizMatchGoals } from '@/interface';

export const formGoalsConfig = (): IForm<IQuizMatchGoals> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'goals_num',
        type: FormTypeEnum.number,
        label: '进球/得分',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'goal_time',
        type: FormTypeEnum.datePickerDatetime,
        label: '进球/得分时间',
      },
      {
        field: 'scorer_name',
        type: FormTypeEnum.input,
        placeholder: '请输入进球/得分人员',
        label: '进球/得分人员',
      },
    ],
  };
};
