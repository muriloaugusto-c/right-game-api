import { cpf } from 'cpf-cnpj-validator'
import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default Factory.define(User, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    doc: cpf.generate(),
    password: faker.internet.password(),
    birthday: DateTime.fromJSDate(faker.date.anytime()),
    phoneNumber: faker.phone.number('+55 ## ##### ####'),
  }
}).build()
