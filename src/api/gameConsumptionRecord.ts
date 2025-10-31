import request from '@/utils/request';

/**
 * 获取游戏消费记录列表
 * @param params 查询参数
 * @returns Promise
 */
export function fetchGameConsumptionRecordList(params) {
  return request.instance({
    url: '/gameConsumptionRecord/agentUserRecords',
    method: 'get',
    params,
  });
}
