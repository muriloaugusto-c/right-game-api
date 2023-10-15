import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  beforeSave,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Address from './Address'
import RequestReservation from './RequestReservation'

type Builder = ModelQueryBuilderContract<typeof User>

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

  @column.date()
  public birthday: DateTime

  @column()
  public phoneNumber: string

  @column()
  public type: 'USER' | 'OWNER' | 'ADMIN'

  @column()
  public addressId: number

  @belongsTo(() => Address, { foreignKey: 'addressId' })
  public address: BelongsTo<typeof Address>

  @hasMany(() => RequestReservation, {})
  public requestReservation: HasMany<typeof RequestReservation>

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
