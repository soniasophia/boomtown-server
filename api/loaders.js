import DataLoader from 'dataloader';
import { myItems, borrowedBy, getUser, getItem } from './jsonServer';

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