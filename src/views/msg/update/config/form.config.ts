import { IForm } from '@/components/Base/Form';
import { msgContentTypeMap, msgTypeMap } from '@/constant';
import { FormTypeEnum, IMsg, MsgIsShowEnum } from '@/interface';

export const formConfig = (): IForm<IMsg> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'id',
        type: FormTypeEnum.number,
        label: 'id',
        rule: { required: true, trigger: 'blur', type: 'number' },
      },
      {
        field: 'live_room_id',
        type: FormTypeEnum.number,
        label: '直播间id',
        rule: { required: true, trigger: 'blur', type: 'number' },
      },
      {
        field: 'live_record_id',
        type: FormTypeEnum.number,
        label: '直播记录id',
        rule: { required: true, trigger: 'blur', type: 'number' },
      },
      {
        field: 'msg_type',
        type: FormTypeEnum.select,
        label: '消息类型',
        options: Object.keys(msgTypeMap).map((v) => {
          return {
            label: msgTypeMap[v],
            value: Number(v),
          };
        }),
        rule: { trigger: 'blur', type: 'any' },
      },
      {
        field: 'content_type',
        type: FormTypeEnum.select,
        label: '内容类型',
        options: Object.keys(msgContentTypeMap).map((v) => {
          return {
            label: msgContentTypeMap[v],
            value: Number(v),
          };
        }),
        rule: { trigger: 'blur', type: 'any' },
      },
      {
        field: 'content',
        type: FormTypeEnum.input,
        label: '内容',
        rule: { trigger: 'blur' },
      },
      {
        field: 'origin_content',
        type: FormTypeEnum.input,
        label: '源内容',
        rule: { trigger: 'blur' },
      },
      {
        field: 'username',
        type: FormTypeEnum.input,
        label: '用户名',
        rule: { trigger: 'blur' },
      },
      {
        field: 'origin_username',
        type: FormTypeEnum.input,
        label: '源用户名',
        rule: { trigger: 'blur' },
      },
      {
        field: 'is_show',
        type: FormTypeEnum.switch,
        label: '是否展示',
        switchConfig: {
          checkedValue: MsgIsShowEnum.yes,
          unCheckedValue: MsgIsShowEnum.no,
          checkedText: '是',
          unCheckedText: '否',
        },
      },
      {
        field: 'send_msg_time',
        type: FormTypeEnum.datePickerDatetime,
        label: '发送消息时间',
      },
      {
        field: 'remark',
        type: FormTypeEnum.input,
        label: '备注',
        rule: { trigger: 'blur' },
      },
    ],
  };
};
