const express = require('express')
const chalk = require('chalk')
const morgan = require('morgan')
const path = require('path')
const expressGraphQL = require('express-graphql')
const log = console.log
const schema = require('../server/schema')
const config = require('./config')
const octokit = require('@octokit/rest')({
  debug: true,
  timeout: 0, // 0 means no request timeout
  requestMedia: 'application/vnd.github.v3+json',
  headers: {
    'user-agent': 'octokit/rest.js v1.2.3' // v1.2.3 will be current version
  },

  // change for custom GitHub Enterprise URL
  host: 'api.github.com',
  pathPrefix: '',
  protocol: 'https',
  port: 443,

  // Node only: advanced request options can be passed as http(s) agent
  agent: undefined
})

octokit.authenticate({
  type: 'oauth',
  token: config.github_key
})

const app = express()

const home = function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
}

const events = function (req, res) {
  // console.log(octokit.activity)
  // const results = octokit.activity.getEvents({}).then(result => { return result })
  res.send(octokit)
}

const eventsForUser = function (req, res) {
  // console.log(octokit.activity)
  // const results = octokit.activity.getEvents({}).then(result => { return result })

  const params = req.params
  const username = params.username || 'scoutsout'
  const page = params.page || 1
  const perPage = params.per_page || 50

  log(username, page, perPage)

  res.send(
    octokit
      .activity.getEventsForUser({ username, page, perPage }).then(result => { return result })
  )
}

const notifications = function (req, res) {
  res.send(
    octokit.activity.getNotifications().then(result => { })
  )
  log(req.params.id)
}

const getUsers = function (req, res) {
  const results = octokit.users.get({})
  res.send(
    results
  )
}

app.use(morgan('dev'))

app.get('/', home)
app.get('/events', events)
app.get('/notifications', notifications)
app.get('/notifications/:id', notifications)
app.get('/users/:username/events', eventsForUser)
app.get('/users', getUsers)

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))

app.listen(config.port, function () {
  log(
    chalk.blue(`The magic happens on port: ${config.port}`)
  )
})
