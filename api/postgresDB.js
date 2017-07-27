import pool from '../database/index';
import admin from '../database/firebase';

function renameId(rows) {
      return rows.map((row) => Object.keys(row).reduce((acc, usr) => {
        acc = {...row, id: row.userid}
        delete acc.userid
        return acc
      }),{})
}

function renameItemId(rows) {
      return rows.map((row) => Object.keys(row).reduce((acc, usr) => {
        acc = {...row, id: row.itemid}
        delete acc.itemid
        return acc
      }),{})
}

export function getUsers() {
  return pool.query(`SELECT * FROM user_profiles`)
    .then(response => {
      return renameId(response.rows);
    }).catch(errors => console.log(errors));
}

export function getUser(id) {
  return new Promise(async(resolve, reject) => {
    try {
      let user = await pool.query(`SELECT * FROM user_profiles WHERE userid = '${id}'`)
      const fbuser = await admin.auth().getUser(id)
      user = renameId(user.rows)[0];
      user = {...user, email: fbuser.email}
      resolve(user);
    } catch (e) {
        console.log(e);
        reject(e);
      }
  })
}

export function createUser(args) {
  return new Promise(async(resolve, reject) => {
    try {
      let fbuser = await admin.auth().createUser({
        email: args.email,
        password: args.password
      })
      const query = {
      text: 'INSERT INTO user_profiles(fullname, bio, userid) VALUES($1, $2, $3) RETURNING *',
      values: [args.fullname, args.bio, fbuser.uid],
      }
      let pgUser = await pool.query(query)
      let user = {...pgUser.rows[0], email: fbuser.email, id: fbuser.uid}
      resolve(user)
    } catch(e) {
        console.log(e);
        reject(e);
    }
  } 
)}

export function getItems() {
  return pool.query(`SELECT * FROM items`)
      .then(response => response.rows)
      .catch(errors => console.log(errors));
}

export function getItem(id) {
  return new Promise(async(resolve, reject) => {
      try {
        let item = await pool.query(`SELECT * FROM items WHERE itemid = '${id}'`)
        item = renameItemId(item.rows)[0];
        // item = {...item, imageUrl: fbuser.imageUrl}
        resolve(item);
      } catch (e) {
          console.log(e);
          reject(e);
        }
    })
}

export function myItems(id) {
  return pool.query(`SELECT * FROM items WHERE itemowner = '${id}'`)
      .then(response => {
        return (response.rows);
      })
      .catch(errors => console.log(errors));
}

export function borrowedBy(id) {
  return pool.query(`SELECT * FROM items WHERE borrower = '${id}'`)
      .then(response => {
        return (response.rows);
      })
      .catch(errors => console.log(errors));
}

export function postNewItem(newItem) {
  return fetch('http://localhost:3001/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      }) 
      .then(response => response.json())
      .catch(errors => console.log(errors));
}

// Get all tags
export function getTags() {
  return pool.query(`SELECT * FROM tags`)
    .then(response => response.rows)
    .catch(errors => console.log(errors));
}

//Get all tags for a given item
export function getItemTags(itemId) {
  return pool.query(`
    SELECT tags.title as tagname
      FROM tags INNER JOIN itemtags 
          ON itemtags.tagid = tags.id
      WHERE itemtags.itemid = ${itemId}
  `)
}

//Get all items for a given tag
export function itemsByTag() {
  return pool.query(`
    SELECT * FROM items
    INNER JOIN itemtags
        ON itemtags.itemid = item.itemid
    WHERE itemtags.tagid = ${tagId}
  `)
}



