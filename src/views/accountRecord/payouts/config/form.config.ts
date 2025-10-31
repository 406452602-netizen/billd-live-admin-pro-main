import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IQuizVotes } from '@/interface';

export const formConfig = (): IForm<IQuizVotes> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'vote_id',
        type: FormTypeEnum.input,
        label: '主键ID',
        rule: { required: true, trigger: 'blur' },
      },
      {
        field: 'odds',
        type: FormTypeEnum.number,
        label: '赔率',
        rule: { required: true, trigger: 'blur' },
      },
      {
        field: 'handicap',
        type: FormTypeEnum.number,
        label: '让球数/分数',
        rule: { required: true, trigger: 'blur' },
      },
      {
        field: 'vote_amount',
        type: FormTypeEnum.number,
        label: '投票花费金额',
        rule: { required: true, trigger: 'blur' },
      },
    ],
  };
};
