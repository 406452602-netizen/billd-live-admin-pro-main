import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IGameConsumptionRecord, ISearch } from '@/interface';

/**
 * 搜索表单配置
 * @returns 搜索表单配置
 * @param _t
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function searchFormConfig(_t): IForm<ISearch<IGameConsumptionRecord>> {
  return {
    gridSpan: 8,
    labelPlacement: 'left',
    formStyle: {
      justifyContent: 'center',
    },
    formItems: [
      {
        field: 'user_id',
        type: FormTypeEnum.input,
        label: '用户ID',
        placeholder: '请输入用户ID',
      },
      {
        field: 'rangTimeType',
        type: FormTypeEnum.datePickerRange,
        label: '消费时间',
        path: 'startTime,endTime',
      },
    ],
  };
}
