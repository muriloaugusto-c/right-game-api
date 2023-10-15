import RequestReservation from 'App/Models/RequestReservation'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(RequestReservation, ({ faker }) => {
  return {
    reservationTime: faker.date.anytime().toISOString(),
    amount: parseInt(faker.finance.amount()),
  }
}).build()
