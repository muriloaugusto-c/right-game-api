import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()

      // RELACIONAMENTO ENTRE A TABELA REQUESTRESERVATIONS
      table.integer('request_reservation_id').unsigned().references('request_reservations.id')
      table
        .enum('status', ['CONFIRMED', 'PROGRESS', 'COMPLETED', 'CANCELED'])
        .defaultTo('CONFIRMED')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
