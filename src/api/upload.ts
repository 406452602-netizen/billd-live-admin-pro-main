import request from '@/utils/request';

export function uploadFile(params) {
  return request.instance({
    url: '/mini/upload-image',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: params,
  });
}
