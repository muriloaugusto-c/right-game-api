import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Address from './Address'
import Inventory from './Inventory'
import SportsCourt from './SportsCourt'
import User from './User'

type Builder = ModelQueryBuilderContract<typeof SportsCenter>

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
  public steakhouse: string

  @column()
  public owner: number

  @belongsTo(() => User, {
    foreignKey: 'owner',
  })
  public ownerUser: BelongsTo<typeof User>

  @column()
  public addressId: number

  @belongsTo(() => Address, {})
  public address: BelongsTo<typeof Address>

  @hasMany(() => SportsCourt, {})
  public sportsCourt: HasMany<typeof SportsCourt>

  @hasOne(() => Inventory, {})
  public inventory: HasOne<typeof Inventory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static withId = scope((query: Builder, id: number) => {
    query.where('id', id)
  })

  public static withText = scope((query: Builder, text: string) => {
    query.where('name', 'LIKE', `%${text}%`)
  })

  public static withOwner = scope((query: Builder, owner: string) => {
    query
      .select('sports_centers.*')
      .join('users', 'sports_centers.owner', 'users.id')
      .where('users.name', 'LIKE', `%${owner}%`)
  })
}
