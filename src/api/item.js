export function create(inputData) {
  var data = inputData.pathData
  return fetch(process.env.VUE_APP_BASE_API + '/apps/' + data.appId + '/envs/' + data.env + '/clusters/' + data.cluster + '/namespaces/' + data.namespaceName + '/item', {
    method: 'post',
    body: JSON.stringify(inputData.data),
    headers: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    return res
  })
}

export function update(inputData) {
  var data = inputData.pathData
  return fetch(process.env.VUE_APP_BASE_API + '/apps/' + data.appId + '/envs/' + data.env + '/clusters/' + data.cluster + '/namespaces/' + data.namespaceName + '/item', {
    method: 'put',
    body: JSON.stringify(inputData.data),
    headers: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    return res
  })
}
export function remove(data) {
  return fetch(process.env.VUE_APP_BASE_API + '/apps/' + data.appId + '/envs/' + data.env + '/clusters/' + data.cluster + '/namespaces/' + data.namespaceName + '/items/' + data.id, {
    method: 'delete'
  }).then((res) => {
    return res
  })
}

export function release(inputData) {
  var data = inputData.pathData
  return fetch(process.env.VUE_APP_BASE_API + '/apps/' + data.appId + '/envs/' + data.env + '/clusters/' + data.cluster + '/namespaces/' + data.namespaceName + '/releases', {
    method: 'post',
    body: JSON.stringify(inputData.data),
    headers: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    return res
  })
}
/*
{
    "releaseTitle": "20211204120448-release",
    "releaseComment": "",
    "isEmergencyPublish": false
}
*/
