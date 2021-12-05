export function fetchList(keyword) {
  return fetch(process.env.VUE_APP_BASE_API + '/users?keyword=' + keyword, {
    method: 'get'
  }).then((res) => {
    return res.json()
  })
}

