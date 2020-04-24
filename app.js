const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser');
//mongdb 配置
const config = require('./config/db')
// 实例化koa 和 router
const app = new Koa()
const router = new Router()

app.use(bodyParser())

// 连接mongoose
mongoose.set('useCreateIndex', true)
mongoose.connect(config.url,config.options)
.then(()=> {
  console.log('mongdb 连接成功')
})
.catch(err => {
  console.log(err)
})

//引入路由
const user = require('./routes/api/user')

//路由
router.get('/', async ctx => {
  ctx.body = {msg: 'hello koa'}
})

router.use('/api/user', user) // /api/user/test
// app.use(user) // /test

//配置路由
app.use(router.routes()).use(router.allowedMethods())
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('http://localhost:5000')
})