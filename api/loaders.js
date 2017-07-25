import DataLoader from 'dataloader';
import { myItems, borrowedBy, getItem } from './jsonServer';
import { getUser } from './postgresDB';
// import { getFirebaseUser } from './firebase';

export default function() {
  return {
    UserOwnedItems: new DataLoader(ids => (
      Promise.all(ids.map(id => myItems(id)))
    )),

    UserBorrowedItems: new DataLoader(ids => (
      Promise.all(ids.map(id => borrowedBy(id)))
    )),

    IndividualUsers: new DataLoader(ids => (
      Promise.all(ids.map(id => getUser(id)))
    )),

    IndividualItems: new DataLoader(ids => (
      Promise.all(ids.map(id => getItem(id)))
    ))
  };
}