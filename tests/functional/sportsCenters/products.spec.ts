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

  test('it should return 403 when user is not owner of sports center', async ({ client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)
    const owner = await UserFactory.merge({ type: 'OWNER' }).create()

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
      .loginAs(owner)

    response.assertStatus(403)
  })

  test('it should return 422 when data is not provided', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/inventory`)
      .json({})
      .loginAs(user)

    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
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

  test('it should return 404 when provided an unexisting product for update', async ({
    client,
  }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)
    await inventory.related('products').create(await ProductFactory.create())

    const productPayload = {
      value: 100,
      quantity: 10,
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/inventory/5`)
      .json(productPayload)
      .loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the updated product', async ({
    client,
  }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)
    await inventory.related('products').create(await ProductFactory.create())
    const owner = await UserFactory.create()

    const productPayload = {
      value: 100,
      quantity: 10,
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/inventory/5`)
      .json(productPayload)
      .loginAs(owner)

    response.assertStatus(403)
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

  test('it should return 404 when provided an unexisting product for delete', async ({
    client,
  }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })
    await sportsCenter.related('inventory').save(inventory)

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}/inventory/5`)
      .json({})
      .loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the sports center', async ({
    client,
  }) => {
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
    const owner = await UserFactory.create()

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}/inventory/${product.id}`)
      .json({})
      .loginAs(owner)

    response.assertStatus(403)
  })

  test('it should return all products by sports center when no query is provided to sports court', async ({
    assert,
    client,
  }) => {
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
    const product2 = await inventory.related('products').create(await ProductFactory.create())

    const response = await client
      .get(`/sportsCenters/${sportsCenter.id}/inventory`)
      .json({})
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().products, 'Products undefined')
    assert.equal(response.body().products[0].products[0].id, product.id)
    assert.equal(response.body().products[0].products[1].id, product2.id)
    assert.equal(response.body().products[0].products[0].name, product.name)
    assert.equal(response.body().products[0].products[1].name, product2.name)
  })

  test('it should return a product by name and sports center', async ({ assert, client }) => {
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
      .get(`/sportsCenters/${sportsCenter.id}/inventory?text=${product.name}`)
      .json({})
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().products[0], 'Products undefined')
    assert.equal(response.body().products[0].id, product.id)
    assert.equal(response.body().products[0].name, product.name)
  })

  test('it should return a product by description and sports center', async ({
    assert,
    client,
  }) => {
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
      .get(`/sportsCenters/${sportsCenter.id}/inventory?text=${product.description}`)
      .json({})
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().products[0], 'Products undefined')
    assert.equal(response.body().products[0].id, product.id)
    assert.equal(response.body().products[0].name, product.name)
    assert.equal(response.body().products[0].description, product.description)
  })
})
