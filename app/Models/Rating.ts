import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import SportsCourt from './SportsCourt'
import User from './User'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @belongsTo(() => User, {})
  public user: BelongsTo<typeof User>

  @column()
  public sportsCourtId: number

  @belongsTo(() => SportsCourt, {})
  public sportsCourt: BelongsTo<typeof SportsCourt>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
