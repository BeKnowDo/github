module.exports = {
  port: process.env.PORT || 5000,
  endpoint: 'api',
  github_key: '3ffe7328cb88cdb71453ff463e293ade418fa8c6',
  database: {
    dev: {
      user: 'root',
      password: '',
      database: 'graphql',
      host: '127.0.0.1',
      dialect: 'mysql'
    },
    prod: {
      user: 'root',
      password: '',
      database: 'graphql',
      host: '127.0.0.1',
      dialect: 'mysql'
    }
  }
}
