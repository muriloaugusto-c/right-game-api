import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import SportsCourt from './SportsCourt'
import User from './User'

export default class RequestReservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public reservationTime: string

  @column()
  public amount: number

  @column()
  public status: 'PENDING' | 'ACCEPTED' | 'REJECTED'

  @hasOne(() => User, {
    foreignKey: 'owner',
  })
  public owner: HasOne<typeof User>

  @hasOne(() => User, {
    foreignKey: 'userId',
  })
  public user: HasOne<typeof User>

  @hasOne(() => SportsCourt, {})
  public sportsCourt: HasOne<typeof SportsCourt>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
