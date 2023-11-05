import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import { cpf } from 'cpf-cnpj-validator'

import AddressFactory from './AddressFactory'

export default Factory.define(User, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    doc: cpf.generate(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate({ refDate: '2023-01-01' }).toString(),
    phoneNumber: faker.phone.number('+55 ## ##### ####'),
  }
})
  .relation('address', () => AddressFactory)
  .state('owner', (user) => (user.type = 'OWNER'))
  .state('admin', (user) => (user.type = 'ADMIN'))
  .build()
