import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'inventories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()

      // RELACIONAMENTO ENTRE A TABELA PRODUCTS
      //table.integer('products_id').unsigned().references('products.id')

      // RELACIONAMENTO ENTRE A TABELA SPORTSCENTERS
      table
        .integer('sports_center_id')
        .unsigned()
        .references('sports_centers.id')
        .onDelete('CASCADE')

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
