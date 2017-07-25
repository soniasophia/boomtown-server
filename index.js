import express from 'express';
import bodyParser from 'body-parser';
import {
  graphqlExpress,
  graphiqlExpress
} from 'graphql-server-express';

import schema from './api/schema';
import cors from 'cors';

import createLoaders from './api/loaders';

const GQL_PORT = 5000;
const app = express();

app.use('*', cors());

app.use('/graphql', bodyParser.json(), graphqlExpress({ 
  schema, 
  context: {
    loaders: createLoaders()
  }
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

app.listen(GQL_PORT, () => console.log(
  `GraphQL is now running localhost:${GQL_PORT}/graphql`
));