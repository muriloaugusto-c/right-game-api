import Inventory from 'App/Models/Inventory'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Inventory, ({ faker }) => {
  return {
    sportsCenterId: faker.number.int(10),
  }
}).build()
