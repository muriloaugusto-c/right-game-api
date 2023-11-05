import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import SportsCourt from './SportsCourt'
import User from './User'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public startTime: DateTime

  @column()
  public endTime: DateTime

  @column()
  public amount: string

  @column()
  public status: 'PENDING' | 'REJECTED' | 'CONFIRMED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELED'

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: BelongsTo<typeof User>

  @column()
  public ownerId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column()
  public userId: number

  @belongsTo(() => SportsCourt, { foreignKey: 'sportsCourtId' })
  public sportsCourt: BelongsTo<typeof SportsCourt>

  @column()
  public sportsCourtId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
