import pool from '../database/index';
import admin from '../database/firebase';

// function renameId(rows) {
//       return rows.map((row) => Object.keys(row).reduce((acc, usr) => {
//         acc = {...row, id: row.userid}
//         delete acc.userid
//         return acc
//       }),{})
// }

// function renameItemId(rows) {
//       return rows.map((row) => Object.keys(row).reduce((acc, usr) => {
//         acc = {...row, id: row.itemid}
//         delete acc.itemid
//         return acc
//       }),{})
// }

export function getUsers() {
  return pool.query(`SELECT * FROM user_profiles`)
    .then(response => {
      return (response.rows);
    }).catch(errors => console.log(errors));
}

export function getUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await pool.query(`SELECT * FROM user_profiles WHERE id = '${id}'`)
      const fbuser = await admin.auth().getUser(id)
      user = (user.rows)[0];
      user = { ...user, email: fbuser.email }
      resolve(user);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
}

export function createUser(args) {
  return new Promise(async (resolve, reject) => {
    try {
      let fbuser = await admin.auth().createUser({
        email: args.email,
        password: args.password
      })
      const query = {
        text: 'INSERT INTO user_profiles(fullname, bio, id) VALUES($1, $2, $3) RETURNING *',
        values: [args.fullname, args.bio, fbuser.uid],
      }
      let pgUser = await pool.query(query)
      let user = { ...pgUser.rows[0], email: fbuser.email, id: fbuser.uid }
      resolve(user)
    } catch (e) {
      console.log(e);
      reject(e);
    }
  }
  )
}

export function getItems() {
  return pool.query(`SELECT * FROM items`)
    .then(response => {
      return response.rows
    })
    .catch(errors => console.log(errors));
}

export function getItem(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let item = await pool.query(`SELECT * FROM items WHERE id = '${id}'`)
      item = (item.rows)[0];
      // item = {...item, imageurl: fbuser.imageurl}
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
    SELECT tags.title FROM tags
    INNER JOIN itemtags
        ON itemtags.tagid = tags.id
    WHERE itemtags.itemid = ${itemId}
  `)
    .then(response => {
      return (response.rows);
    })
    .catch(errors => console.log(errors));
}

//Get all items for a given tag
export function itemsByTag(tagId) {
  return pool.query(`
    SELECT * FROM items
    INNER JOIN itemtags
        ON itemtags.itemid = item.id
    WHERE itemtags.tagid = ${tagId}
  `)
    .then(response => {
      return (response.rows);
    })
    .catch(errors => console.log(errors));
}

//Add new item
export function newItem(args, context) {
  return new Promise(async (resolve, reject) => {
    try {
      const itemQuery = {
        text: `INSERT INTO items(title, description, imageurl, itemowner) VALUES($1, $2, $3, $4) RETURNING *`,
        values: [args.title, args.description, args.imageurl, args.itemowner],
      }
      const newItem = await pool.query(itemQuery)
      function insertTag(tags) {
        return tags.map(tag => {
          return `(${newItem.rows[0].id}, ${tag.id})`
        }).join(',')
      }
      const tagQuery = {
        text: `INSERT INTO itemtags(itemid, tagid) VALUES ${insertTag(args.tags)}`
      }
      const tags = await pool.query(tagQuery)
      resolve({id: newItem.rows[0].id})
    } catch (error) {
      reject(error)
    }
  })
}



