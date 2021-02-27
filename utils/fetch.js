fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: `{ user(email:${email}, password:${password}) }`})
})
  .then(r => r.json())
  .then(data => data)