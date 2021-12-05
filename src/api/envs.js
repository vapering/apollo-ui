export function get(query) {
  return fetch(process.env.VUE_APP_BASE_API + '/envs', {
    method: 'get'
  }).then((res) => {
    return res.json()
  })
}

export function getNavtree(appId) {
  return fetch(process.env.VUE_APP_BASE_API + '/apps/' + appId + '/navtree', {
    method: 'get'
  }).then((res) => {
    return res.json()
  })
}
