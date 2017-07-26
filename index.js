import express from 'express';
import { } from 'dotenv/config';
import bodyParser from 'body-parser';
import {
  graphqlExpress,
  graphiqlExpress
} from 'graphql-server-express';

import schema from './api/schema';
import admin from './database/firebase';
import cors from 'cors';

import createLoaders from './api/loaders';

const GQL_PORT = 5000;
const app = express();
const PORT = process.env.PORT;

app.use('*', cors());
app.use(bodyParser.json());


// app.use('/graphql', (req, res, next) => {
//   const { operationName, variables } = req.body
//   if (operationName && operationName === 'addUser') {
//     admin.auth().createCustomToken(variables.email).then(function (token) {
//       req.body.token = token
//       next()
//     }).catch(function (error) {
//       console.log(error)
//       next()
//     })
//   } else {
//     next()
//   }
// });


app.use('/graphql', graphqlExpress(function(req, res) {
  return {
    schema,
    context: {
      loaders: createLoaders()
    }
  }
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

app.listen(GQL_PORT, () => console.log(
  `GraphQL is now running localhost:${GQL_PORT}/graphql`
));