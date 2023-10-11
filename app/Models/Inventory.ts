import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Product from './Product'
import SportsCenter from './SportsCenter'

type Builder = ModelQueryBuilderContract<typeof SportsCenter>

export default class Inventory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasMany(() => Product, {})
  public products: HasMany<typeof Product>

  @column()
  public sportsCenterId: number

  @belongsTo(() => SportsCenter, {
    foreignKey: 'sportsCenterId',
  })
  public sportsCenter: BelongsTo<typeof SportsCenter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
