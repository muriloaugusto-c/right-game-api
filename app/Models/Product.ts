import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Inventory from './Inventory'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public value: string

  @column()
  public quantity: number

  @column()
  public description: string

  @column()
  public photoUrls: string

  @belongsTo(() => Inventory, {
    foreignKey: 'inventoryId',
  })
  public inventoryId: BelongsTo<typeof Inventory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
