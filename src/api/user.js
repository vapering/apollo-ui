import request from '@/utils/request'
// import jq from 'jquery'

export function login(data) {
  var formData = new FormData()

  formData.append('username', data['username'])
  formData.append('password', data['password'])

  return fetch(process.env.VUE_APP_BASE_API + '/signin', {
    body: formData,
    method: 'POST'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return fetch(process.env.VUE_APP_BASE_API + '/user/logout', {
    method: 'get'
  })
}
