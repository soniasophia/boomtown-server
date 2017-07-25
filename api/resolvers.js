import fetch from 'node-fetch';
import * as json from './jsonServer';

const resolveFunctions = {
  Query: {
    users() {
      return json.getUsers()
    },
    user: (root, {id}, context) => {
      // return json.getUser(id)
      return context.loaders.IndividualUsers.load(id);
    },
    items() {
      return json.getItems()
    },
    item: (root, {id}, context) => {
      // return json.getItem(id)
      return context.loaders.IndividualItems.load(user.id);
    }
  },

  Item: {
    itemOwner(item) {
      return json.getUser(item.itemOwner)
    },
    borrower(item) {
      if (!item.borrower) return null;
      return json.getUser(item.borrower)
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
      const newItem = {
        title: args.title,
        imageUrl: args.imageUrl,
        itemOwner: args.itemOwner,
        description: args.description,
        createdOn: Math.floor(Date.now() / 1000),
        tags: args.tags,
        available: true,
        borrower: null
      };

      return json.postNewItem(newItem)
    }
  }
};

export default resolveFunctions;