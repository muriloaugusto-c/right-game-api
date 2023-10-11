import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AddressFactory from 'Database/factories/AddressFactory'
import SportsCenterFactory from 'Database/factories/SportsCenterFactory'
import SportsCourtFactory from 'Database/factories/SportsCourtFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('SportsCenter', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a sports court', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()

    const sportsCourtPayload = {
      name: 'Quadra A',
      modality: 'Futebol',
      description: 'Futsal',
      size: '30x40m',
      photoUrls: 'quadra.png',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts`)
      .json(sportsCourtPayload)

    response.assertStatus(201)
    assert.exists(response.body().sportsCourt, 'Sports Court Undefined')
    assert.exists(response.body().sportsCourt.id, 'ID Undefined')
    assert.equal(response.body().sportsCourt.name, sportsCourtPayload.name)
    assert.equal(response.body().sportsCourt.modality, sportsCourtPayload.modality)
    assert.equal(response.body().sportsCourt.description, sportsCourtPayload.description)
    assert.equal(response.body().sportsCourt.size, sportsCourtPayload.size)
    assert.equal(response.body().sportsCourt.photo_urls, sportsCourtPayload.photoUrls)
  })

  test('it should update a sports court', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()

    const sportsCourtPayload = {
      name: 'Quadra do Tio Zé',
      description: 'Quadra do Tiozão',
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}`)
      .json(sportsCourtPayload)

    response.assertStatus(200)
    assert.exists(response.body().sportsCourt, 'Sports Courts Undefined')
    assert.exists(response.body().sportsCourt.id, 'ID Undefined')
    assert.equal(response.body().sportsCourt.name, sportsCourtPayload.name)
    assert.equal(response.body().sportsCourt.description, sportsCourtPayload.description)
    assert.equal(response.body().sportsCourt.photo_urls, sportsCourt.photoUrls)
    assert.equal(response.body().sportsCourt.modality, sportsCourt.modality)
    assert.equal(response.body().sportsCourt.size, sportsCourt.size)
  })

  test('it should delete a sport court', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}`)
      .json({})

    response.assertStatus(200)
  })
})
