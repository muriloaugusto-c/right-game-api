import { BaseModel, belongsTo, BelongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import SportsCourt from './SportsCourt'
import User from './User'
import Reservation from './Reservation'

export default class RequestReservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public reservationTime: string

  @column()
  public amount: number

  @column()
  public status: 'PENDING' | 'ACCEPTED' | 'REJECTED'

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

  @hasOne(() => Reservation, {})
  public reservation: HasOne<typeof Reservation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
