export function get(query) {
  return fetch(process.env.VUE_APP_BASE_API + '/apps', {
    // body: query,
    method: 'get'
  }).then((res) => {
    return res.json()
  })
}

export function create(data) {
  return fetch(process.env.VUE_APP_BASE_API + '/apps', {
    body: JSON.stringify(data),
    method: 'post',
    headers: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    return res.json()
  })
}
