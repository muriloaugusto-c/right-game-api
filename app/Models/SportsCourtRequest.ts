import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import SportsCourt from './SportsCourt'

export default class SportsCourtRequest extends BaseModel {
  public static table = 'sports_courts_requests'

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'user_id', serializeAs: 'userId' })
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column({ columnName: 'sports_court_id', serializeAs: 'sportsCourtId' })
  public sportsCourtId: number

  @belongsTo(() => SportsCourt, {
    foreignKey: 'sportsCourtId',
  })
  public sportsCourt: BelongsTo<typeof SportsCourt>

  @column()
  public status: string

  @column({ columnName: 'reservation_time', serializeAs: 'reservationTime' })
  public reservationTime: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
