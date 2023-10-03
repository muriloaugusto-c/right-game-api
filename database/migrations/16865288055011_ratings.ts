import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ratings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()

      table.string('text').notNullable()

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('user_id').notNullable().unsigned().references('users.id')

      // RELACIONAMENTO ENTRE A TABELA SPORTSCOURTS
      table
        .integer('sports_courts_id')
        .notNullable()
        .unsigned()
        .references('sports_courts.id')
        .onDelete('CASCADE')

      // RELACIONAMENTO ENTRE A TABELA RESERVATIONS
      table.integer('reservations_id').notNullable().unsigned().references('reservations.id')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
