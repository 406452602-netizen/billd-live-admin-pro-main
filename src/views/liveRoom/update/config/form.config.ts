import { IForm } from '@/components/Base/Form';
import { liveRoomTypeEnumMap } from '@/constant';
import {
  FormTypeEnum,
  ILiveRoom,
  LiveRoomIsShowEnum,
  LiveRoomOpenChatEnum,
  LiveRoomStatusEnum,
} from '@/interface';

export const formConfig = (): IForm<ILiveRoom> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'title',
        type: FormTypeEnum.input,
        label: '直播间标题',
        rule: { required: true, trigger: 'blur' },
      },
      {
        field: 'desc',
        type: FormTypeEnum.input,
        label: '直播间简介',
        rule: { trigger: 'blur' },
      },
      {
        field: 'priority',
        type: FormTypeEnum.number,
        label: '直播间权重',
        rule: { required: true, trigger: 'blur', type: 'number' },
      },
      {
        field: 'key',
        type: FormTypeEnum.input,
        label: '推流秘钥',
        rule: { required: true, trigger: 'blur', type: 'string' },
      },
      {
        field: 'type',
        type: FormTypeEnum.select,
        label: '直播间类型',
        disabled: true,
        options: Object.keys(liveRoomTypeEnumMap).map((v) => {
          return {
            label: liveRoomTypeEnumMap[v],
            value: Number(v),
          };
        }),
        rule: { trigger: 'blur', type: 'any' },
      },
      {
        field: 'cover_img',
        type: FormTypeEnum.upload,
        uploadConfig: {
          max: 1,
        },
        label: '开播预览图',
      },
      {
        field: 'bg_img',
        type: FormTypeEnum.upload,
        uploadConfig: {
          max: 1,
        },
        label: '直播间背景',
      },
      {
        field: 'status',
        type: FormTypeEnum.radio,
        label: '直播间状态',
        options: [
          { label: '正常', value: LiveRoomStatusEnum.normal },
          { label: '禁用', value: LiveRoomStatusEnum.disable },
        ],
        rule: { required: true, trigger: 'blur', type: 'number' },
      },
      {
        field: 'is_show',
        type: FormTypeEnum.switch,
        label: '直播间是否显示',
        switchConfig: {
          checkedValue: LiveRoomIsShowEnum.yes,
          unCheckedValue: LiveRoomIsShowEnum.no,
          checkedText: '显示',
          unCheckedText: '隐藏',
          defaultValue: LiveRoomIsShowEnum.yes,
        },
        rule: { trigger: 'blur', type: 'number' },
      },
      {
        field: 'open_chat',
        type: FormTypeEnum.switch,
        label: '直播间是否开启聊天',
        switchConfig: {
          checkedValue: LiveRoomOpenChatEnum.yes,
          unCheckedValue: LiveRoomOpenChatEnum.no,
          checkedText: '开启',
          unCheckedText: '关闭',
          defaultValue: LiveRoomOpenChatEnum.yes,
        },
        rule: { trigger: 'blur', type: 'number' },
      },
      {
        field: 'notice_msg',
        type: FormTypeEnum.input,
        label: '公告',
        rule: { trigger: 'blur' },
      },
      {
        field: 'system_msg',
        type: FormTypeEnum.input,
        label: '系统消息',
        rule: { trigger: 'blur' },
      },
      {
        field: 'forward_bilibili_url',
        type: FormTypeEnum.input,
        label: '转推b站直播',
        rule: { trigger: 'blur' },
      },
      {
        field: 'forward_douyu_url',
        type: FormTypeEnum.input,
        label: '转推斗鱼直播',
        rule: { trigger: 'blur' },
      },
      {
        field: 'forward_huya_url',
        type: FormTypeEnum.input,
        label: '转推虎牙直播',
        rule: { trigger: 'blur' },
      },
      {
        field: 'forward_douyin_url',
        type: FormTypeEnum.input,
        label: '转推抖音直播',
        rule: { trigger: 'blur' },
      },
      {
        field: 'forward_kuaishou_url',
        type: FormTypeEnum.input,
        label: '转推快手直播',
        rule: { trigger: 'blur' },
      },
      {
        field: 'forward_xiaohongshu_url',
        type: FormTypeEnum.input,
        label: '转推小红书直播',
        rule: { trigger: 'blur' },
      },
      {
        field: 'remark',
        type: FormTypeEnum.input,
        label: '直播间备注',
        rule: { trigger: 'blur' },
      },
    ],
  };
};
