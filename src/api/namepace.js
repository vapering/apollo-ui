export function get(query) {
  return fetch(process.env.VUE_APP_BASE_API + '/apps/' + query.appId + '/envs/' + query.env + '/clusters/' + query.cluster + '/namespaces', {
    method: 'get'
  }).then((res) => {
    return res.json()
  })
}
