import request from '@/utils/request.ts';

export function fetchInviteAgentList(data) {
  return request.instance({
    url: '/inviteAgent/list',
    method: 'post',
    data,
  });
}

export function createInviteAgent(data) {
  return request.instance({
    url: '/inviteAgent/create',
    method: 'post',
    data,
  });
}

export function updateInviteAgent(data) {
  return request.instance({
    url: '/inviteAgent/update',
    method: 'put',
    data,
  });
}

export function fetchInviteAgentById(id) {
  return request.instance({
    url: `/inviteAgent/${id}`,
    method: 'get',
  });
}

export function inviteAgentRegister(data) {
  return request.instance({
    url: '/inviteAgent/register',
    method: 'post',
    data,
  });
}
