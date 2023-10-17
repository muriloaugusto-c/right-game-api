import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AddressFactory from 'Database/factories/AddressFactory'
import SportsCenterFactory from 'Database/factories/SportsCenterFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('SportsCenter', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a Sports Center', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()

    const sportsCenterPayload = {
      name: 'JB',
      photoUrls: 'html',
      events: 'não',
      contactNumber: '41 999651 0004',
      parking: 'sim',
      steakhouse: 'sim',
      owner: user.id,
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.post('/sportsCenters').json(sportsCenterPayload).loginAs(user)

    response.assertStatus(201)
    assert.exists(response.body().sportsCenter, 'Sports Center undefined')
    assert.exists(response.body().sportsCenter.id, 'Id undefined')
    assert.equal(response.body().sportsCenter.name, sportsCenterPayload.name)
    assert.equal(response.body().sportsCenter.contact_number, sportsCenterPayload.contactNumber)
    assert.equal(response.body().sportsCenter.parking, sportsCenterPayload.parking)
    assert.equal(response.body().sportsCenter.steakhouse, sportsCenterPayload.steakhouse)
    assert.equal(response.body().sportsCenter.owner, user.id)
  })

  test('it should return 403 when user is not owner', async ({ client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id }).create()

    const sportsCenterPayload = {
      name: 'JB',
      photoUrls: 'html',
      events: 'não',
      contactNumber: '41 999651 0004',
      parking: 'sim',
      steakhouse: 'sim',
      owner: user.id,
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.post('/sportsCenters').json(sportsCenterPayload).loginAs(user)

    response.assertStatus(403)
  })

  test('it should return 422 when data is not provided', async ({ client, assert }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()

    const response = await client.post('/sportsCenters').json({}).loginAs(user)

    assert.equal(response.body().code, 'BAD_REQUEST')
    response.assertStatus(422)
  })

  test('it should update a Sports Center', async ({ client, assert }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()

    const sportsCenterPayload = {
      name: 'JB',
      photoUrls: 'html',
      events: 'não',
      contactNumber: '41 999651 0004',
      parking: 'sim',
      steakhouse: 'sim',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}`)
      .json(sportsCenterPayload)
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().sportsCenter, 'Sports Center undefined')
    assert.exists(response.body().sportsCenter.id, 'Id undefined')
    assert.equal(response.body().sportsCenter.name, sportsCenterPayload.name)
    assert.equal(response.body().sportsCenter.photo_urls, sportsCenterPayload.photoUrls)
    assert.equal(response.body().sportsCenter.contact_number, sportsCenterPayload.contactNumber)
    assert.equal(response.body().sportsCenter.parking, sportsCenterPayload.parking)
    assert.equal(response.body().sportsCenter.steakhouse, sportsCenterPayload.steakhouse)
    assert.equal(response.body().sportsCenter.owner, user.id)
    assert.equal(response.body().address.street, sportsCenterPayload.street)
    assert.equal(response.body().address.street_number, sportsCenterPayload.streetNumber)
    assert.equal(response.body().address.zip_code, sportsCenterPayload.zipCode)
    assert.equal(response.body().address.state, sportsCenterPayload.state)
    assert.equal(response.body().address.city, sportsCenterPayload.city)
    assert.equal(response.body().address.neighborhood, sportsCenterPayload.neighborhood)
  })

  test('it should return 404 when provided an unexisting sports center for update', async ({
    client,
  }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()

    const response = await client.put(`/sportsCenters/5`).json({}).loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the updated sports center', async ({
    client,
  }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const owner = await UserFactory.merge({ type: 'OWNER' }).create()

    const sportsCenterPayload = {
      name: 'JB',
      photoUrls: 'html',
      events: 'não',
      contactNumber: '41 999651 0004',
      parking: 'sim',
      steakhouse: 'sim',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}`)
      .json(sportsCenterPayload)
      .loginAs(owner)

    response.assertStatus(403)
  })

  test('it should delete a Sports Center', async ({ client, assert }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()

    const response = await client.delete(`/sportsCenters/${sportsCenter.id}`).json({}).loginAs(user)

    response.assertStatus(200)
    assert.notExists(response.body().sportsCenter, 'Sports Center defined')
  })

  test('it should return 404 when provided an unexisting sports center for delete', async ({
    client,
  }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()

    const response = await client.delete(`/sportsCenters/5`).json({}).loginAs(user)

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
    const owner = await UserFactory.merge({ type: 'OWNER' }).create()

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}`)
      .json({})
      .loginAs(owner)

    response.assertStatus(403)
  })

  test('it should return all sports centers when no query is provided to sports centers', async ({
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

    const user2 = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address2 = await AddressFactory.create()
    const sportsCenter2 = await SportsCenterFactory.merge({
      addressId: address2.id,
      owner: user2.id,
    }).create()

    const response = await client.get('/sportsCenters').json({})

    response.assertStatus(200)
    assert.exists(response.body().sportsCenters, 'Sports Centers undefined')
    assert.equal(response.body().sportsCenters[0].id, sportsCenter.id)
    assert.equal(response.body().sportsCenters[1].id, sportsCenter2.id)
    assert.equal(response.body().sportsCenters[0].name, sportsCenter.name)
    assert.equal(response.body().sportsCenters[1].name, sportsCenter2.name)
  })

  test('it should return sports center by sport center id', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()

    const response = await client.get(`/sportsCenters?sportsCenterId=${sportsCenter.id}`).json({})
    response.assertStatus(200)
    assert.exists(response.body().sportsCenters, 'Sports Center undefined')
    assert.equal(response.body().sportsCenters[0].id, sportsCenter.id)
    assert.equal(response.body().sportsCenters[0].name, sportsCenter.name)
  })

  test('it should return sports center by owner', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const address2 = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const sportsCenter2 = await SportsCenterFactory.merge({
      addressId: address2.id,
      owner: user.id,
    }).create()
    await SportsCenterFactory.createMany(10)

    const response = await client.get(`/sportsCenters?owner=${user.name}`).json({})

    response.assertStatus(200)
    assert.exists(response.body().sportsCenters, 'Sports Centers undefined')
    assert.equal(response.body().sportsCenters[0].id, sportsCenter.id)
    assert.equal(response.body().sportsCenters[0].name, sportsCenter.name)
    assert.equal(response.body().sportsCenters[0].owner, user.id)

    assert.equal(response.body().sportsCenters[1].id, sportsCenter2.id)
    assert.equal(response.body().sportsCenters[1].name, sportsCenter2.name)
    assert.equal(response.body().sportsCenters[1].owner, user.id)

    assert.notExists(response.body().sportsCenters[2], 'Sports Center 3 defined')
  })

  test('it should return sports center by name', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id, type: 'OWNER' }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()

    await SportsCenterFactory.createMany(10)

    const response = await client.get(`/sportsCenters?text=${sportsCenter.name}`).json({})

    assert.equal(response.body().sportsCenters[0].id, sportsCenter.id)
    assert.equal(response.body().sportsCenters[0].name, sportsCenter.name)
    assert.equal(response.body().sportsCenters[0].owner, user.id)
  })
})
