const express = require('express')
const chalk = require('chalk')
const morgan = require('morgan')
const path = require('path')
const expressGraphQL = require('express-graphql')
const log = console.log
const schema = require('../server/schema')

const config = { port: process.env.PORT || 5000 }
const app = express()

const router = function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
}
app.use(morgan('dev'))
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))

app.get('/', router)

app.listen(config.port, function () {
  log(
    chalk.blue(`The magic happens on port: ${config.port}`)
  )
})
