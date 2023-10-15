import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AddressFactory from 'Database/factories/AddressFactory'
import RequestReservationFactory from 'Database/factories/RequestReservationFactory'
import SportsCenterFactory from 'Database/factories/SportsCenterFactory'
import SportsCourtFactory from 'Database/factories/SportsCourtFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Request Reservation', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a rating in a sports court', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const address2 = await AddressFactory.create()
    const user2 = await UserFactory.merge({ addressId: address2.id }).create()
    const requestReservation = await RequestReservationFactory.merge({
      userId: user2.id,
      ownerId: user.id,
      sportsCourtId: sportsCourt.id,
    }).create()

    const test = await client
      .put(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/accept`)
      .json({})

    const ratingPayload = {
      text: 'Quadra muito boa',
    }

    const reservation = test.body().reservation

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/rating`)
      .json(ratingPayload)

    response.assertStatus(201)
    assert.exists(response.body().rating, 'Rating undefined')
    assert.exists(response.body().rating.id, 'Id undefined')
    assert.equal(response.body().rating.text, ratingPayload.text)
  })

  test('it should updte a rating in a sports court', async ({ assert, client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id }).create()
    const address = await AddressFactory.create()
    const sportsCenter = await SportsCenterFactory.merge({
      addressId: address.id,
      owner: user.id,
    }).create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const address2 = await AddressFactory.create()
    const user2 = await UserFactory.merge({ addressId: address2.id }).create()
    const requestReservation = await RequestReservationFactory.merge({
      userId: user2.id,
      ownerId: user.id,
      sportsCourtId: sportsCourt.id,
    }).create()

    const test = await client
      .put(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/accept`)
      .json({})

    const ratingPayload = {
      text: 'Quadra muito ruim',
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/rating`)
      .json(ratingPayload)

    response.assertStatus(201)
    assert.exists(response.body().rating, 'Rating undefined')
    assert.exists(response.body().rating.id, 'Id undefined')
    assert.equal(response.body().rating.text, ratingPayload.text)
  })
})
