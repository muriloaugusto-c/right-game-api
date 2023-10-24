import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import RequestReservation from './RequestReservation'
import Rating from './Rating'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public requestReservationId: number

  @column()
  public status: 'CONFIRMED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELED'

  @belongsTo(() => RequestReservation, { foreignKey: 'requestReservationId' })
  public requestReservation: BelongsTo<typeof RequestReservation>

  @hasOne(() => Rating, {})
  public rating: HasOne<typeof Rating>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
