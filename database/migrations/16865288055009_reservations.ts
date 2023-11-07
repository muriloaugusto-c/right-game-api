import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.timestamp('start_time', { useTz: true }).notNullable()
      table.timestamp('end_time', { useTz: true }).notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table
        .enum('status', [
          'PENDING',
          'REJECTED',
          'CONFIRMED',
          'IN PROGRESS',
          'COMPLETED',
          'CANCELED',
        ])
        .defaultTo('PENDING')
        .notNullable()

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('owner_id').unsigned().references('users.id')

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('user_id').unsigned().references('users.id')

      // RELACIONAMENTO ENTRE A TABELA SPORTSCOURT
      table.integer('sports_court_id').unsigned().references('sports_courts.id')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
