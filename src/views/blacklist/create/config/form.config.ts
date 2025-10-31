import { IForm } from '@/components/Base/Form';
import { blacklistTypeEnumMap } from '@/constant';
import { FormTypeEnum, IBlacklist } from '@/interface';

export const formConfig = (): IForm<IBlacklist> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'type',
        type: FormTypeEnum.select,
        label: '黑名单类型',
        options: Object.keys(blacklistTypeEnumMap).map((v) => {
          return {
            label: blacklistTypeEnumMap[v],
            value: Number(v),
          };
        }),
        rule: { trigger: 'blur', type: 'any' },
      },
      {
        field: 'client_ip',
        type: FormTypeEnum.input,
        label: 'ip',
      },
      {
        field: 'live_room_id',
        type: FormTypeEnum.number,
        label: '直播间id',
        rule: { trigger: 'blur', type: 'number' },
      },
      {
        field: 'user_id',
        type: FormTypeEnum.number,
        label: '用户id',
        rule: { trigger: 'blur', type: 'number' },
      },
      {
        field: 'msg',
        type: FormTypeEnum.input,
        label: '提示语',
        rule: { trigger: 'blur' },
      },
      {
        field: 'remark',
        type: FormTypeEnum.input,
        label: '备注',
        rule: { trigger: 'blur' },
      },
      {
        field: 'start_date',
        type: FormTypeEnum.datePickerDatetime,
        label: '开始时间',
        rule: { trigger: 'blur', type: 'any' },
      },
      {
        field: 'end_date',
        type: FormTypeEnum.datePickerDatetime,
        label: '结束时间',
        rule: { trigger: 'blur', type: 'any' },
      },
    ],
  };
};
