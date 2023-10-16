import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from './User'
import SportsCenter from './SportsCenter'

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

  @hasOne(() => User, { foreignKey: 'addressId' })
  public user: HasOne<typeof User>

  @hasOne(() => SportsCenter, {
    foreignKey: 'addressId',
  })
  public sportsCenter: HasOne<typeof SportsCenter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
