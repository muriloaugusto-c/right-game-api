import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import RequestReservation from './RequestReservation'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public requestReservationId: number

  @belongsTo(() => RequestReservation, { foreignKey: 'requestReservationId' })
  public requestReservation: BelongsTo<typeof RequestReservation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
