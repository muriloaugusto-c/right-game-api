import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Product from './Product'
import SportsCenter from './SportsCenter'

export default class Inventory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasMany(() => Product, {
    foreignKey: 'products',
  })
  public products: HasMany<typeof Product>

  @belongsTo(() => SportsCenter, {
    foreignKey: 'sportsCenterId',
  })
  public sportsCenter: BelongsTo<typeof SportsCenter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
