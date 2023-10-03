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

  @belongsTo(() => User, {})
  public userId: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
