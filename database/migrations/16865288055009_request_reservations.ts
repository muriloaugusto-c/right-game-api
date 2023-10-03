import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_reservations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.string('reservation_time').notNullable()
      table.integer('amount').notNullable()
      table.enum('status', ['PENDING', 'ACCEPTED', 'REJECTED']).defaultTo('PENDING').notNullable()

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('owner').notNullable().unsigned().references('users.id')

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('user_id').notNullable().unsigned().references('users.id')

      // RELACIONAMENTO ENTRE A TABELA SPORTSCOURT
      table.integer('sports_court_id').notNullable().unsigned().references('sports_courts.id')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
