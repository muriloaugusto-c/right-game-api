import Factory from '@ioc:Adonis/Lucid/Factory'
import RequestReservation from 'App/Models/RequestReservation'
import { DateTime } from 'luxon'

import UserFactory from './UserFactory'

export default Factory.define(RequestReservation, ({ faker }) => {
  return {
    startTime: DateTime.fromJSDate(faker.date.anytime()),
    endTime: DateTime.fromJSDate(faker.date.anytime()).toISO({ includeOffset: false }),
    amount: faker.finance.amount(),
  }
})
  .relation('owner', () => UserFactory)
  .relation('user', () => UserFactory)
  .build()
