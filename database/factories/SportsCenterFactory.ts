import Factory from '@ioc:Adonis/Lucid/Factory'
import SportsCenter from 'App/Models/SportsCenter'

import AddressFactory from './AddressFactory'
import SportsCourtFactory from './SportsCourtFactory'

export default Factory.define(SportsCenter, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    photoUrls: faker.internet.url(),
    contactNumber: faker.phone.number('+55 ## ##### ####'),
    parking: faker.datatype.boolean(),
    steakhouse: faker.datatype.boolean(),
  }
})
  .relation('address', () => AddressFactory)
  .relation('sportsCourt', () => SportsCourtFactory)
  .build()
