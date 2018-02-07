const express = require('express')
const chalk = require('chalk')
const morgan = require('morgan')
const log = console.log

const app = express()
const config = {
  port: 5000
}

app.use(morgan('dev'))

app.get('/', function (req, res) {
  res.send(`Development server running on port: ${config.port}`)
})

app.listen(config.port, function () {
  log(
    chalk.blue(`Development server running on port: ${config.port}`),
    log(chalk`
      CPU: {red ${cpu.totalPercent}%}
      RAM: {green ${ram.used / ram.total * 100}%}
      DISK: {rgb(255,131,0) ${disk.used / disk.total * 100}%}
    `)
  )
})