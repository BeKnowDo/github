const Sequelize = require('sequelize')
const env = require('../config/env')
const databaseConfig = require('../config/config.json')

const databaseEnvConfig = databaseConfig.database[env]

console.log(databaseEnvConfig)
