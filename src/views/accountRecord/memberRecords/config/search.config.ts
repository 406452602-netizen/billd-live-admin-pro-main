import { IForm } from '@/components/Base/Form';
import { FormTypeEnum, IList, ISearch } from '@/interface';

interface IMemberRecordSearch extends IList<any> {
  user_id?: number;
  parent_user_id?: number;
  start_time?: string;
  end_time?: string;
  username?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const searchFormConfig = (_): IForm<ISearch<IMemberRecordSearch>> => {
  return {
    gridSpan: 8,
    labelPlacement: 'left',
    formStyle: {
      justifyContent: 'center',
    },
    formItems: [
      {
        field: 'rangTimeType',
        type: FormTypeEnum.datePickerRange,
        label: '时间范围',
      },
      {
        field: 'username',
        type: FormTypeEnum.input,
        label: '用户名',
      },
      {
        field: 'user_id',
        type: FormTypeEnum.number,
        label: '用户ID',
      },
    ],
  };
};
