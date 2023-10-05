import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Address from './Address'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public doc: number

  @column({ serializeAs: null })
  public password: string

  @column.dateTime()
  public birthday: DateTime

  @column()
  public phoneNumber: string

  @column()
  public type: 'USER' | 'OWNER' | 'ADMIN'

  @column()
  public addressId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }
}
