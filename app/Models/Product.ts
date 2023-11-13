import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Inventory from './Inventory'

type Builder = ModelQueryBuilderContract<typeof Product>

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public value: number

  @column()
  public quantity: number

  @column()
  public description: string

  @column()
  public inventoryId: number

  @belongsTo(() => Inventory, {
    foreignKey: 'inventoryId',
  })
  public inventory: BelongsTo<typeof Inventory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static withText = scope((query: Builder, text: string, sportsCenterId: number) => {
    query
      .select('products.*')
      .join('inventories', 'products.inventory_id', 'inventories.id')
      .where('inventories.sports_center_id', sportsCenterId)
      .andWhere('products.name', 'LIKE', `%${text}%`)
      .orWhere('products.description', 'LIKE', `%${text}%`)
  })
}
