import pool from '../database/index';
import admin from '../database/firebase';

function renameId(rows) {
      return rows.map((row) => Object.keys(row).reduce((acc, usr) => {
        acc = {...row, id: row.userid}
        delete acc.userid
        return acc
      }),{})
}

export function getUsers() {
  return pool.query(`SELECT * from user_profiles`)
    .then(response => {
      return renameId(response.rows);
    }).catch(errors => console.log(errors));
}

export function getUser(id) {
  return new Promise(async(resolve, reject) => {
    try {
      let user = await pool.query(`SELECT * from user_profiles WHERE userid = '${id}'`)
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

