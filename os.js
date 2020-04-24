const os = require('os')
const men = os.freemem() / os.totalmem() *100

console.log(men)

const {promisify} = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)

readFile('./package.json').then(res => {
  console.log(res.toString())
})