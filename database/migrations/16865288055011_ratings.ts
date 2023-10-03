import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ratings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()

      table.string('text').notNullable()

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('user_id').unsigned().references('users.id')

      // RELACIONAMENTO ENTRE A TABELA SPORTSCENTERS
      table
        .integer('sports_center_id')
        .unsigned()
        .references('sports_centers.id')
        .onDelete('CASCADE')

      // RELACIONAMENTO ENTRE A TABELA RESERVATIONS
      table.integer('reservations_id').unsigned().references('reservations.id')

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
