import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sports_centers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()

      table.string('name').notNullable()
      table.string('photo_urls').notNullable()
      table.string('events')
      table.string('contact_number').notNullable()
      table.string('parking')
      table.string('steakhouse')

      // RELACIONAMENTO ENTRE A TABELA USERS
      table.integer('owner').notNullable().unsigned().references('users.id').onDelete('CASCADE')

      // RELACIONAMENTO ENTRE A TABELA ADDRESSES
      table.integer('address_id').notNullable().unsigned().references('addresses.id')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
