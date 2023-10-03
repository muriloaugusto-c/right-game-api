import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.string('street').notNullable()
      table.integer('street_number').notNullable()
      table.integer('zip_code').notNullable()
      table.string('state').notNullable()
      table.string('city').notNullable()
      table.string('neighborhood').notNullable()

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
