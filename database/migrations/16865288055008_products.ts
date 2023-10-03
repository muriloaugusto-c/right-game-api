import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.string('name').notNullable()
      table.integer('value').notNullable()
      table.integer('quantity').notNullable()
      table.string('description').notNullable()
      table.string('photo_urls').notNullable()

      // RELACIONAMENTO ENTRE A TABELA INVENTORY
      table.integer('inventory_id').unsigned().references('inventories.id')

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
