import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sports_courts_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table
        .integer('sports_court_id')
        .unsigned()
        .references('id')
        .inTable('sports_courts')
        .notNullable()
      table.enum('status', ['PENDING', 'ACCEPTED', 'REJECTED']).defaultTo('PENDING').notNullable()
      table.string('reservation_time').notNullable

      //table.timestamps(true)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
