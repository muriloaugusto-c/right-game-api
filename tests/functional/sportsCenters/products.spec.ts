import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Inventory from 'App/Models/Inventory'
import AddressFactory from 'Database/factories/AddressFactory'
import ProductFactory from 'Database/factories/ProductFactory'
import SportsCenterFactory from 'Database/factories/SportsCenterFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('SportsCenter', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a product in inventory', async ({ client, assert }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)

    const productPayload = {
      name: 'Colete',
      value: 15,
      quantity: 5,
      description: 'Aluguel de colete',
      photoUrls: 'roupas.png',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/inventory`)
      .json(productPayload)
      .loginAs(user)

    response.assertStatus(201)
    assert.exists(response.body().product, 'Product Undefined')
    assert.exists(response.body().product.id, 'ID Undefined')
    assert.equal(response.body().product.name, productPayload.name)
    assert.equal(response.body().product.value, productPayload.value)
    assert.equal(response.body().product.quantity, productPayload.quantity)
    assert.equal(response.body().product.description, productPayload.description)
    assert.equal(response.body().product.photo_urls, productPayload.photoUrls)
  })

  test('it should update a product', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)
    const product = await inventory.related('products').create(await ProductFactory.create())

    const productPayload = {
      value: 100,
      quantity: 10,
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/inventory/${product.id}`)
      .json(productPayload)
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().product, 'Product Undefined')
    assert.exists(response.body().product.id, 'ID Undefined')
    assert.equal(response.body().product.value, productPayload.value)
    assert.equal(response.body().product.quantity, productPayload.quantity)
    assert.equal(response.body().product.name, product.name)
    assert.equal(response.body().product.photo_urls, product.photoUrls)
    assert.equal(response.body().product.description, product.description)
  })

  test('it should delete a product', async ({ client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)
    const product = await inventory.related('products').create(await ProductFactory.create())

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}/inventory/${product.id}`)
      .json({})
      .loginAs(user)

    response.assertStatus(200)
  })
})
