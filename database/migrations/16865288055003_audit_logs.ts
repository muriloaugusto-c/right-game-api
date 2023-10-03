import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()

      table.string('action').notNullable()
      table.string('details').notNullable()

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('user_id').notNullable().unsigned().references('users.id')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
