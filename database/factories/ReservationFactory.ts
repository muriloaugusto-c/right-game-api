import Factory from '@ioc:Adonis/Lucid/Factory'
import Reservation from 'App/Models/Reservation'
import { DateTime } from 'luxon'

import UserFactory from './UserFactory'

export default Factory.define(Reservation, ({ faker }) => {
  const timeStart = DateTime.fromJSDate(faker.date.future())
  return {
    startTime: timeStart,
    endTime: timeStart.plus({ hours: 1 }),
    amount: faker.finance.amount(),
  }
})
  .relation('owner', () => UserFactory)
  .relation('user', () => UserFactory)
  .build()
