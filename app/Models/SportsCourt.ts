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

import Rating from './Rating'
import Reservation from './Reservation'
import SportsCenter from './SportsCenter'

type Builder = ModelQueryBuilderContract<typeof SportsCourt>

export default class SportsCourt extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public modality: string

  @column()
  public description: string

  @column()
  public size: string

  @column()
  public photoUrls: string

  @column()
  public sportsCenterId: number

  @column()
  public amount: number

  @belongsTo(() => SportsCenter, {
    foreignKey: 'sportsCenterId',
  })
  public sportsCenter: BelongsTo<typeof SportsCenter>

  @hasMany(() => Reservation, {})
  public reservations: HasMany<typeof Reservation>

  @hasMany(() => Rating, {})
  public rating: HasMany<typeof Rating>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static withText = scope((query: Builder, text: string, sportsCenterId: number) => {
    query
      .where('sports_center_id', sportsCenterId)
      .andWhere('name', 'LIKE', `%${text}%`)
      .orWhere('description', 'LIKE', `%${text}%`)
  })

  public static withId = scope((query: Builder, sportsCourtId: number) => {
    query.where('id', sportsCourtId)
  })
}
