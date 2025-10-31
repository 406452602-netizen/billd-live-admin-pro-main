import request from '@/utils/request.ts';

/** 权限列表(分页) */
export function fetchAdCarouselList(data) {
  return request.instance({
    url: '/adCarousel/list',
    method: 'post',
    data,
  });
}

export function addAdCarousel(data) {
  return request.instance({
    url: '/adCarousel/create',
    method: 'post',
    data,
  });
}

export function editAdCarousel(data) {
  return request.instance({
    url: `/adCarousel/update/${data.id}`,
    method: 'put',
    data,
  });
}

export function findAdCarouselById(id) {
  return request.instance({
    url: `/adCarousel/find/${id}`,
    method: 'get',
  });
}

export function deleteAdCarousel(id) {
  return request.instance({
    url: `/adCarousel/delete/${id}`,
    method: 'delete',
  });
}
