const graphql = require('graphql')
const axios = require('axios')
const chalk = require('chalk')
const log = console.log
let url = `http://localhost:8000`
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql

function getUsersURL (parentValue = null, args) {
  log(chalk.red('LOG - Get users url: '), parentValue, args)
  return axios.get(`${url}/users/${args.id}`)
    .then(resp => resp.data)
    .then(data => data)
}

function getCompaniesUrl (parentValue = null, args) {
  log(chalk.green('LOG - Get companies url: '), parentValue, args)
  return axios.get(`${url}/companies/${args.id}`)
  .then(resp => resp.data)
}

function getUserCompany (parentValue = null, args) {
  log(chalk.red('LOG - Getting company users: '), parentValue, args)
  return axios.get(`${url}/companies/${parentValue.companyId}`)
  .then(resp => resp.data)
}

function getCompanyUsers (parentValue = null, args) {
  log(chalk.blue('LOG - Getting company user list: ', parentValue, args))
  return axios.get(`${url}/companies/${parentValue.id}/users`)
    .then(resp => resp.data)
}

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    users: {
      type: new GraphQLList(UserType),
      resolve (parentValue, args) {
        return getCompanyUsers(parentValue, args)
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    company: {
      type: CompanyType,
      resolve (parentValue, args) {
        return getUserCompany(parentValue, args)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve (parentValue, args) {
        return getUsersURL(parentValue, args)
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve (parentValue, args) {
        return getCompaniesUrl(parentValue, args)
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        companyId: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve (parentValue, { firstName, lastName, companyId }) {
        return axios.post(`${url}/users`, {
          firstName,
          lastName,
          companyId
        })
        .then(res => res.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve (parentValue, { id }) {
        return axios.delete(`${url}/users/${id}`)
        .then(res => res.data)
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return axios.patch(`${url}/users/${args.id}`, args)
        .then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
