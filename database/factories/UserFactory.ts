import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default Factory.define(User, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    doc: faker.number.int({ min: 11, max: 11 }),
    password: faker.internet.password(),
    birthday: DateTime.fromJSDate(faker.date.anytime()),
    phoneNumber: faker.phone.number('+55 ## ##### ####'),
  }
}).build()
