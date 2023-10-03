import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sports_centers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()

      table.string('name').notNullable()
      table.string('photo_urls').notNullable()
      table.string('events').notNullable()
      table.string('contact_number').notNullable()
      table.string('parking').notNullable()
      table.string('steakhouse').notNullable()

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('owner').unsigned().references('users.id').onDelete('CASCADE')

      // RELACIONAMENTO ENTRE A TABELA SPORTSCOURTS
      //table.integer('sports_court_id').unsigned().references('sports_courts.id')

      // RELACIONAMENTO ENTRE A TABELA INVENTORIES
      //table.integer('inventory_id').unsigned().references('inventories.id')

      // RELACIONAMENTO ENTRE A TABELA ADDRESSES
      table.integer('address_id').unsigned().references('addresses.id')

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
