import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from './User'

export default class AuditLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public action: string

  @column()
  public details: string

  @column()
  public userId: number

  @belongsTo(() => User, {})
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
