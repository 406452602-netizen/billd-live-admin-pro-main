import request from '@/utils/request.ts';

export function changeWallet(data) {
  return request.put(`/wallet/change`, data);
}

export function fetchBankList(params) {
  return request.get(`/wallet/bank/list`, { params });
}

export function addBank(data) {
  return request.post('/wallet/bank/create', data);
}

export function editBank(data) {
  return request.put(`/wallet/bank/update`, data);
}

export function deleteBank(id) {
  return request.delete(`/wallet/bank/delete${id}`);
}

export function fetchRechargeRecordsList(params) {
  return request.get(`/wallet/rechargeRecords/list`, { params });
}

export function fetchRechargeRecordsDetails(id) {
  return request.get(`/wallet/rechargeRecords/find/${id}`);
}

export function auditRecharge(data) {
  return request.put(`/wallet/rechargeRecords/audit`, data);
}

export function fetchWithdrawalRecordsList(params) {
  return request.get(`/wallet/withdrawalRecords/list`, { params });
}

export function fetchWithdrawalRecordsDetails(id) {
  return request.get(`/wallet/withdrawalRecords/find/${id}`);
}

export function auditWithdrawal(data) {
  return request.put(`/wallet/withdrawalRecords/audit`, data);
}

export const getBankCards = (params) => {
  return request.get('/wallet/userBankCard/list', { params });
};

export const getBankCardDetails = (id) => {
  return request.get(`/wallet/userBankCard/find/${id}`);
};

export const createUserBankCard = (data) => {
  return request.post('/wallet/userBankCard/create', data);
};

export const updateUserBankCard = (data) => {
  return request.put('/wallet/userBankCard/update', data);
};

export const deleteUserBankCard = (id) => {
  return request.delete(`/wallet/userBankCard/delete/${id}`);
};

export function getBanks(params) {
  return request.get('/wallet/bank/list', { params });
}

export function getUseRechargeTarget() {
  return request.get('/wallet/getUseRechargeTarget');
}

export function setUseRechargeTarget(data) {
  return request.put(`/wallet/setUseRechargeTarget/${data}`);
}
