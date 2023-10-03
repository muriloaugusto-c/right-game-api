import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Reservation from './Reservation'
import SportsCourt from './SportsCourt'
import User from './User'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @hasOne(() => User, {})
  public user: HasOne<typeof User>

  @hasOne(() => SportsCourt, {})
  public sportsCourt: HasOne<typeof SportsCourt>

  @hasOne(() => Reservation, {})
  public reservation: HasOne<typeof Reservation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
