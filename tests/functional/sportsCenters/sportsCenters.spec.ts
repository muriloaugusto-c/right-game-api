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
})
