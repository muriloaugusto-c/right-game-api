import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('doc').notNullable().unique()
      table.string('password').notNullable()
      table.date('birthday').notNullable()
      table.string('phone_number').notNullable()
      table.enum('type', ['USER', 'OWNER', 'ADMIN']).defaultTo('USER').notNullable()

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('address_id').notNullable().references('addresses_id')

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
