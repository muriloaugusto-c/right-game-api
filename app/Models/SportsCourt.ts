import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import SportsCenter from './SportsCenter'

export default class SportsCourt extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public modality: string

  @column()
  public description: string

  @column()
  public size: string

  @column()
  public photoUrls: string

  @belongsTo(() => SportsCenter, {
    foreignKey: 'sportsCenterId',
  })
  public sportsCenterId: BelongsTo<typeof SportsCenter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
