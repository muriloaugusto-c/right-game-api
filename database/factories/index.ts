import Factory from '@ioc:Adonis/Lucid/Factory'
import Address from 'App/Models/Address'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    doc: faker.number.int({ min: 11, max: 11 }),
    password: faker.internet.password(),
    //birthday: faker.date.anytime(),
    phoneNumber: faker.phone.number('+55 ## ##### ####'),
  }
}).build()

export const AddressFactory = Factory.define(Address, ({ faker }) => {
  return {
    street: faker.location.state(),
    streetNumber: parseInt(faker.location.buildingNumber()),
    zipCode: parseInt(faker.location.zipCode()),
    state: faker.location.state(),
    city: faker.location.city(),
    neighborhood: faker.location.city(),
  }
}).build()

export const UserWithAddressFactory = Factory.define(Address, async ({ faker }) => {
  const user = await UserFactory.create()
  const address = await AddressFactory.create()

  // Associe o endereço ao usuário
  await address.related('user').save(user)

  return user
}).build()
