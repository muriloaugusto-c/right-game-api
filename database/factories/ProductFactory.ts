import Factory from '@ioc:Adonis/Lucid/Factory'
import Product from 'App/Models/Product'

export default Factory.define(Product, ({ faker }) => {
  return {
    name: faker.commerce.product(),
    value: faker.commerce.price(),
    quantity: faker.number.int({ max: 20 }),
    description: faker.commerce.productDescription(),
  }
}).build()
