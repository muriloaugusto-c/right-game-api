import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Address from './Address'
import Inventory from './Inventory'
import SportsCourt from './SportsCourt'
import User from './User'

export default class SportsCenter extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public photoUrls: string

  @column()
  public events: string

  @column()
  public contactNumber: string

  @column()
  public parking: string

  @column()
  public steakHouse: string

  @belongsTo(() => User, {
    foreignKey: 'owner',
  })
  public owner: BelongsTo<typeof User>

  @hasMany(() => SportsCourt, {})
  public sportsCourt: HasMany<typeof SportsCourt>

  @hasOne(() => Inventory, {})
  public inventory: HasOne<typeof Inventory>

  @hasOne(() => Address, {})
  public address: HasOne<typeof Address>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
