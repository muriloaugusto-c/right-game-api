import Factory from '@ioc:Adonis/Lucid/Factory'
import SportsCenter from 'App/Models/SportsCenter'

import AddressFactory from './AddressFactory'
import SportsCourtFactory from './SportsCourtFactory'

export default Factory.define(SportsCenter, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    photoUrls: faker.internet.url(),
    events: faker.string.alpha('sim'),
    contactNumber: faker.phone.number('+55 ## ##### ####'),
    parking: faker.string.alpha('sim'),
    steakhouse: faker.string.alpha('sim'),
  }
})
  .relation('address', () => AddressFactory)
  .relation('sportsCourt', () => SportsCourtFactory)
  .build()
