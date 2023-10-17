import { DateTime } from 'luxon'
import RequestReservation from 'App/Models/RequestReservation'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(RequestReservation, ({ faker }) => {
  return {
    startTime: DateTime.fromJSDate(faker.date.anytime()),
    endTime: DateTime.fromJSDate(faker.date.anytime()),
    amount: parseInt(faker.finance.amount()),
  }
}).build()
