import Factory from '@ioc:Adonis/Lucid/Factory'
import Address from 'App/Models/Address'

export default Factory.define(Address, ({ faker }) => {
  return {
    street: faker.location.state(),
    streetNumber: parseInt(faker.location.buildingNumber()),
    zipCode: parseInt(faker.location.zipCode()),
    state: faker.location.state(),
    city: faker.location.city(),
    neighborhood: faker.location.city(),
  }
}).build()
