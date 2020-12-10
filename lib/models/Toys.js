const pool = require('../utils/pool');

module.exports = class Toy {
  id;
  type;
  name;
  color;
  childId;

  constructor(row) {
    this.id = row.id;
    this.type = row.type;
    this.name = row.name;
    this.color = row.color;
    this.childId = row.child_id;
  }

  static async insert({ type, name, color, child_id }) {
    const results = await pool.query(
      'INSERT INTO toys (type, name, color, child_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, name, color, child_id]
    );

    return new Toy(results.rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM toys WHERE id=$1',
      [id]
    );

    if(!rows[0]) throw Error(`No toy with id ${id} found.`);

    return new Toy(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM toys');

    return rows.map(row => new Toy(row));
  }

  static async update(id, { type, name, color }) {
    const { rows } = await pool.query(
      `UPDATE toys
        SET type=$1,
            name=$2,
            color=$3
        WHERE id=$4
        RETURNING *`,
      [type, name, color, id]
    );
    if(!rows[0]) throw Error(`No toy with id ${id} found.`);

    return new Toy(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM toys WHERE id=$1 RETURNING *',
      [id]
    );

    return new Toy(rows[0]);
  }
};
