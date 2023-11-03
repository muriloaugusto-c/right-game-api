import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import { cpf } from 'cpf-cnpj-validator'
import { DateTime } from 'luxon'

import AddressFactory from './AddressFactory'

export default Factory.define(User, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    doc: cpf.generate(),
    password: faker.internet.password(),
    birthday: DateTime.fromJSDate(faker.date.anytime()),
    phoneNumber: faker.phone.number('+55 ## ##### ####'),
  }
})
  .relation('address', () => AddressFactory)
  .state('owner', (user) => (user.type = 'OWNER'))
  .state('admin', (user) => (user.type = 'ADMIN'))
  .build()
