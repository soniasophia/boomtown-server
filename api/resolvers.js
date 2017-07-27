import fetch from 'node-fetch';
import * as json from './jsonServer';
import pool from '../database/index';
import { getUsers, getUser } from './postgresDB';
import * as psql from './postgresDB';

const resolveFunctions = {
  Query: {
    users() {
      return getUsers()
    },
    user: (root, {id}, context) => {
      // return json.getUser(id)
      return context.loaders.IndividualUsers.load(id);
    },
    items() {
      return psql.getItems()
    },
    item: (root, {id}, context) => {
      // return json.getItem(id)
      return context.loaders.IndividualItems.load(id);
    }
  },

  Item: {
    tags: (items) => {
      return psql.getItemTags(item.id);
    },
    itemowner(item, args, context) {
      return context.loaders.IndividualUsers.load(item.itemowner);
    },
    borrower(item, args, context) {
      if (!item.borrower) return null;
      return context.loaders.IndividualUsers.load(item.borrower);
    }
  },
  User: {
    items: (user, args, context) => {
      // return json.myItems(user)
      return context.loaders.UserOwnedItems.load(user.id);

    },
    borrowed: (user, args, context) => {
      // return json.borrowedBy(user.id)
      return context.loaders.UserBorrowedItems.load(user.id);
    }
  },

    Mutation: {
    addItem(root, args) {
      return psql.newItem(args)
      // const newItem = {
      //   title: args.title,
      //   imageurl: args.imageurl,
      //   itemowner: args.itemowner,
      //   description: args.description,
      //   createdon: Math.floor(Date.now() / 1000),
      //   tags: args.tags,
      //   available: true,
      //   borrower: null
      // };

      // return json.postNewItem(newItem)
    },

    addUser(root, args, context) {
      return psql.createUser(args, context)
    }
  }
};

export default resolveFunctions;