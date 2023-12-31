import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  beforeSave,
  column,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Address from './Address'
import Rating from './Rating'
import Reservation from './Reservation'
import SportsCenter from './SportsCenter'

type Builder = ModelQueryBuilderContract<typeof User>

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public doc: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public birthdate: string

  @column()
  public phoneNumber: string

  @column()
  public type: 'USER' | 'OWNER' | 'ADMIN'

  @hasOne(() => Address, { foreignKey: 'userId' })
  public address: HasOne<typeof Address>

  @hasMany(() => SportsCenter, { foreignKey: 'ownerId' })
  public SportsCenter: HasMany<typeof SportsCenter>

  @hasMany(() => Reservation, {})
  public reservation: HasMany<typeof Reservation>

  @hasMany(() => Rating, {})
  public rating: HasMany<typeof Rating>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }

  public static withId = scope((query: Builder, id: number) => {
    query.where('id', id)
  })

  public static withText = scope((query: Builder, text: string) => {
    query.where('name', 'LIKE', `%${text}%`).orWhere('email', 'LIKE', `%${text}%`)
  })
}
