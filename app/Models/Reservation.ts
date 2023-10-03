import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import RequestReservation from './RequestReservation'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => RequestReservation, {})
  public requestReservation: HasOne<typeof RequestReservation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
