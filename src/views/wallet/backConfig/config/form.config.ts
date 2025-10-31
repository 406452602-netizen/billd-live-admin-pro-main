import { IForm } from '@/components/Base/Form';
import {
  bankTypeEnum,
  FormTypeEnum,
  IBank,
  LiveRoomIsShowEnum,
} from '@/interface.ts';

export const formConfig = (protocolTypeListOption): IForm<IBank> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'bank_name',
        label: '银行/虚拟币名称',
        type: FormTypeEnum.input,
        rule: {
          required: true,
          message: '请输入银行名称',
          trigger: 'blur',
        },
      },
      {
        field: 'type',
        label: '是否虚拟币',
        type: FormTypeEnum.switch,
        switchConfig: {
          checkedValue: bankTypeEnum.VIRTUAL,
          unCheckedValue: bankTypeEnum.BANK,
          checkedText: '是',
          unCheckedText: '否',
        },
      },
      {
        field: 'protocol_type_list',
        label: '银行卡类型/虚拟币协议',
        type: FormTypeEnum.checkbox,
        options: protocolTypeListOption,
        rule: {
          required: true,
          message: '请选择银行卡类型/虚拟币协议',
        },
      },
      {
        field: 'is_domestic',
        label: '是否国内',
        type: FormTypeEnum.switch,
        switchConfig: {
          checkedValue: LiveRoomIsShowEnum.yes,
          unCheckedValue: LiveRoomIsShowEnum.no,
          checkedText: '是',
          unCheckedText: '否',
        },
      },
      {
        field: 'logo',
        type: FormTypeEnum.upload,
        uploadConfig: {
          max: 1,
        },
        label: 'logo',
      },
    ],
  };
};
