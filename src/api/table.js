import request from '@/utils/request'
export function tableList(data) {
  return request({
    url: 'http://localhost:3001/table/list',
    method: 'post',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: '/table/delete',
    method: 'post',
    data
  })
}
export function editItem(data) {
  return request({
    url: '/table/edit',
    method: 'post',
    data
  })
}