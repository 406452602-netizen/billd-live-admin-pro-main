import { IForm } from '@/components/Base/Form';
import { bankTypeEnum, FormTypeEnum, IUserBankCard } from '@/interface.ts';

export const formConfig = (
  bankOption,
  protocolTypeListOption
): IForm<IUserBankCard> => {
  return {
    gridSpan: 18,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'bank_type',
        label: '存储类型',
        type: FormTypeEnum.switch,
        switchConfig: {
          checkedValue: bankTypeEnum.VIRTUAL,
          unCheckedValue: bankTypeEnum.BANK,
          checkedText: '虚拟账号',
          unCheckedText: '银行卡',
        },
      },
      {
        field: 'bank_id',
        label: '银行/虚拟币',
        type: FormTypeEnum.select,
        options: bankOption,
        rule: {
          required: true,
          message: '请选择银行/虚拟币类型',
        },
      },
      {
        field: 'protocol_type',
        label: '协议/银行类型',
        type: FormTypeEnum.select,
        options: protocolTypeListOption,
        rule: {
          required: true,
          message: '请选择银行卡类型/虚拟币协议',
        },
      },
      {
        field: 'card_number',
        label: '银行卡号',
        type: FormTypeEnum.input,
        rule: {
          required: true,
          message: '请输入银行名称',
          trigger: 'blur',
        },
      },
      {
        field: 'holder_name',
        label: '持卡人姓名',
        type: FormTypeEnum.input,
        rule: {
          required: true,
          message: '请输入银行名称',
          trigger: 'blur',
        },
      },
    ],
  };
};
