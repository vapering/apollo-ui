export function fetchList(keyword) {
  return fetch(process.env.VUE_APP_BASE_API + '/organizations', {
    method: 'get',
    param: { keyword: keyword }
  }).then((res) => {
    return res.json()
  })
}

