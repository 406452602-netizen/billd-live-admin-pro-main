import { IForm } from '@/components/Base/Form';
import { InviteAgentMap } from '@/constant.ts';
import { FormTypeEnum, IInviteAgent } from '@/interface';
import { useUserStore } from '@/store/user';

const userInfo = useUserStore();
const maxAccount = Number(userInfo.userInfo?.agent_account_for) * 100;

export const formConfig = (): Promise<IForm<IInviteAgent>> => {
  return Promise.resolve({
    gridSpan: 16,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'invite_class',
        type: FormTypeEnum.select,
        label: '邀请类型',
        options: Object.keys(InviteAgentMap).map((v) => {
          return {
            label: InviteAgentMap[v],
            value: Number(v),
          };
        }),
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'expiration_time',
        type: FormTypeEnum.datePickerDatetime,
        label: '过期时间',
        // 修改isDateDisable方法，禁止今天及以前的时间
        isDateDisable: (ts: number) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 设置为今天凌晨0点
          return ts < today.getTime();
        },
        rule: {
          required: true,
          trigger: 'blur',
          type: 'any',
          validator: (rule, value) => {
            console.log('rule', rule);
            const currentTime = new Date().getTime();
            console.log('value', value, currentTime);
            if (value < currentTime) {
              return new Error('过期时间不能小于当前时间');
            }
            return true;
          },
        },
      },
      {
        field: 'agent_account_for',
        type: FormTypeEnum.number,
        label: `代理人比例(0%-${maxAccount}%)`,
        step: 5,
        placeholder: `请输入整数代理人比例`,
        max: maxAccount,
        min: 0,
        rule: {
          required: true,
          trigger: 'blur',
          type: 'number',
          validator: (rule, value) => {
            console.log('rule', rule);
            if (value > maxAccount || value < 0) {
              return new Error(`代理人比例不能大于${maxAccount}或小于0`);
            }
            if (!Number.isInteger(value)) {
              return new Error('代理人比例必须是整数');
            }
          },
        },
      },
    ],
  });
};

export const notInviteFormConfig = (): Promise<IForm<IInviteAgent>> => {
  return Promise.resolve({
    gridSpan: 16,
    formStyle: {
      justifyContent: 'center',
    },
    labelPlacement: 'left',
    formItems: [
      {
        field: 'invite_class',
        type: FormTypeEnum.select,
        label: '邀请类型',
        options: Object.keys(InviteAgentMap).map((v) => {
          return {
            label: InviteAgentMap[v],
            value: Number(v),
          };
        }),
        rule: { required: true, trigger: 'blur', type: 'any' },
      },
      {
        field: 'expiration_time',
        type: FormTypeEnum.datePickerDatetime,
        label: '过期时间',
        // 修改notInviteFormConfig中的isDateDisable方法
        isDateDisable: (ts: number) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 设置为今天凌晨0点
          return ts < today.getTime();
        },
        rule: {
          required: true,
          trigger: 'blur',
          type: 'any',
          validator: (rule, value) => {
            console.log('rule', rule);
            const currentTime = new Date().getTime();
            console.log('value', value, currentTime);
            if (value < currentTime) {
              return new Error('过期时间不能小于当前时间');
            }
            return true;
          },
        },
      },
    ],
  });
};
