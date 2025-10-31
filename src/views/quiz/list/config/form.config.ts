import { ref } from 'vue';

import { IForm } from '@/components/Base/Form';
// import { QuizMatchTypeEnumMap } from '@/constant.ts';
import { FormTypeEnum, IQuizMatches } from '@/interface';

export const formConfig = ({
  quizTypeOption,
  quizSeasonsOption,
  quizTeamOption,
  liveRoomOption,
  bureauOption,
}: {
  quizTypeOption: ReturnType<typeof ref<{ label: any; value: number }[]>>;
  quizSeasonsOption: ReturnType<
    typeof ref<{ label: any; value: number; quiz_match_types: number }[]>
  >;
  quizTeamOption: ReturnType<typeof ref<{ label: any; value: number }[]>>;
  formData: ReturnType<typeof ref<any>>;
  liveRoomOption: ReturnType<typeof ref<{ label: any; value: number }[]>>;
  bureauOption: ReturnType<typeof ref<{ label: any; value: any }[]>>;
}): IForm<IQuizMatches> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'match_name',
        type: FormTypeEnum.input,
        label: '比赛名称',
        rule: { required: true, trigger: 'blur' },
      },
      {
        field: 'type_id',
        type: FormTypeEnum.radio,
        label: '比赛类型',
        options: quizTypeOption.value,
      },
      {
        field: 'season_id',
        type: FormTypeEnum.select,
        options: quizSeasonsOption.value,
        label: '赛季',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'team_id',
        type: FormTypeEnum.radio,
        options: quizTeamOption.value,
        label: '比赛队伍1',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'tax_rate',
        type: FormTypeEnum.number,
        options: quizTeamOption.value,
        label: '税率',
        step: 0.01,
        max: 1,
        min: 0,
        rule: {
          required: true,
          type: 'any',
          trigger: 'blur',
        },
      },
      {
        field: 'team_id2',
        type: FormTypeEnum.radio,
        options: quizTeamOption.value,
        label: '比赛队伍2',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'bureau_number',
        type: FormTypeEnum.select,
        options: bureauOption.value,
        label: '比赛局数',
      },
      // {
      //   field: 'match_type',
      //   type: FormTypeEnum.radio,
      //   label: '比赛阶段类型',
      //   options: Object.keys(QuizMatchTypeEnumMap).map((v) => {
      //     return {
      //       label: QuizMatchTypeEnumMap[v],
      //       value: Number(v),
      //     };
      //   }),
      //   rule: { required: true, trigger: 'blur', type: 'any' },
      // },
      {
        field: 'description',
        type: FormTypeEnum.input,
        label: '比赛描述',
        rule: {
          max: 50,
          trigger: 'blur',
          message: '描述不能超过50个字符',
        },
      },
      {
        field: 'competition_order',
        type: FormTypeEnum.number,
        label: '比赛序列',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'rangTime',
        type: FormTypeEnum.datePickerRange,
        label: '时间范围',
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'live_room_id',
        type: FormTypeEnum.select,
        label: '关联直播间',
        options: liveRoomOption.value,
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
    ],
  };
};
