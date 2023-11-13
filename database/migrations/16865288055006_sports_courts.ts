import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sports_courts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.string('name').notNullable()
      table.string('modality').notNullable()
      table.string('description').notNullable()
      table.string('size')
      table.string('photo_urls')
      table.float('amount')

      // RELACIONAMENTO ENTRE A TABELA SPORTSCENTER
      table
        .integer('sports_center_id')
        .notNullable()
        .unsigned()
        .references('sports_centers.id')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
