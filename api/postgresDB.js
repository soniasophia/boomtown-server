import pool from '../database/index';

export function getUsers() {
  return pool.query(`SELECT * from user_profiles`)
    .then(response => {
      return response.rows;
    }).catch(errors => console.log(errors));
}

export function getUser(id) {
  return pool.query(`SELECT * from user_profiles WHERE userid = '${id}'`)
    .then(response => {
      return response.rows[0];
    }).catch(errors => console.log(errors));
}

