import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sports_courts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.string('modality').notNullable()
      table.string('description').notNullable()
      table.string('size').notNullable()
      table.string('photoUrls').notNullable()

      // RELACIONAMENTO ENTRE A TABELA SPORTSCENTER
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
