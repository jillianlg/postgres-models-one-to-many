const pool = require('../utils/pool');

module.exports = class Child {
  id;
  name;
  age;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.age = row.age;
  }

  static async insert({ name, age }) {
    const results = await pool.query(
      'INSERT INTO children (name, age) VALUES ($1, $2) RETURNING *',
      [name, age]
    );

    return new Child(results.rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM children WHERE id=$1',
      [id]
    );

    if(!rows[0]) throw Error(`No child with id ${id} found.`);

    return new Child(rows[0]);
  }
};
