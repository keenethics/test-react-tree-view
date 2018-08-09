export const request = (path, method = 'GET', data = null) => new Promise((resolve, reject) => {
  fetch(path, {
    method,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
    credentials: 'same-origin',
    body: data && JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    })
    .then(resolve)
    .catch(reject)
})
