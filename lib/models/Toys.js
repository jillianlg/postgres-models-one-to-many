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
};
