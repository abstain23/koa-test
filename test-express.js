const express = require('./express')
const app = express()

app.get('/', (req, res) => {
  res.end('<h1>test express</h1>')
})

app.get('/user',(req, res) => {
  res.end(JSON.stringify({
    user: 'zs'
  }))
})
app.listen(3000)