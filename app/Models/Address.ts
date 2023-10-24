import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import SportsCenter from './SportsCenter'
import User from './User'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public street: string

  @column()
  public streetNumber: number

  @column()
  public zipCode: number

  @column()
  public state: string

  @column()
  public city: string

  @column()
  public neighborhood: string

  @column()
  public userId: number

  @column()
  public sportsCenterId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => SportsCenter, {
    foreignKey: 'sportsCenterId',
  })
  public sportsCenter: BelongsTo<typeof SportsCenter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
