import Factory from '@ioc:Adonis/Lucid/Factory'
import SportsCourt from 'App/Models/SportsCourt'

import SportsCenterFactory from './SportsCenterFactory'

export default Factory.define(SportsCourt, ({ faker }) => {
  return {
    name: faker.company.name(),
    modality: faker.lorem.word(),
    description: faker.lorem.word(),
    size: faker.lorem.word(),
    photoUrls: faker.internet.url(),
  }
})
  .relation('sportsCenter', () => SportsCenterFactory)
  .build()
