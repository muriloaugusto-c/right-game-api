import Factory from '@ioc:Adonis/Lucid/Factory'
import SportsCourt from 'App/Models/SportsCourt'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    cpf: faker.number.int(11),
    password: faker.internet.password(),
    birthday: DateTime.fromFormat('08-05-1999', 'dd-MM-yyyy'),
    phoneNumber: faker.phone.number('+55 41 #####-####'),
  }
}).build()

export const SportsCourtFactory = Factory.define(SportsCourt, ({ faker }) => {
  return {
    name: faker.company.name(),
    description: faker.company.buzzVerb(),
    location: faker.location.country(),
  }
}).build()
