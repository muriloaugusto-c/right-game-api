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

  test('it should create a request reservation', async ({ client, assert }) => {
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

    const requestReservationPayload = {
      reservationTime: '19:00:00 ~ 20:00:00',
      amount: 510,
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/requestReservations`)
      .json(requestReservationPayload)

    console.log(response.body().requestReservation)
    response.assertStatus(201)
    assert.exists(response.body().requestReservation, 'Request Reservation undefined')
    assert.exists(response.body().requestReservation.id, 'ID Undefined')
    assert.equal(
      response.body().requestReservation.reservation_time,
      requestReservationPayload.reservationTime
    )
    assert.equal(response.body().requestReservation.amount, requestReservationPayload.amount)
    assert.equal(response.body().requestReservation.owner_id, user.id)
    assert.equal(response.body().requestReservation.sports_court_id, sportsCourt.id)
    assert.equal(response.body().requestReservation.user_id, 2)
  })

  test('it should update a request Reservation', async ({ assert, client }) => {
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

    const requestReservationPayload = {
      reservationTime: '19:00:00 ~ 20:00:00',
      amount: 510,
    }

    const response = await client
      .put(`/requestReservations/${requestReservation.id}`)
      .json(requestReservationPayload)

    response.assertStatus(200)
    assert.exists(response.body().requestReservation, 'Request Reservation undefined')
    assert.exists(response.body().requestReservation.id, 'ID Undefined')
    assert.equal(
      response.body().requestReservation.reservation_time,
      requestReservationPayload.reservationTime
    )
    assert.equal(response.body().requestReservation.amount, requestReservationPayload.amount)
    assert.equal(response.body().requestReservation.owner_id, user.id)
    assert.equal(response.body().requestReservation.sports_court_id, sportsCourt.id)
    assert.equal(response.body().requestReservation.user_id, user2.id)
  })

  test('it should delete a request reservation', async ({ assert, client }) => {
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

    const response = await client.delete(`/requestReservations/${requestReservation.id}`).json({})

    response.assertStatus(200)
    assert.notExists(response.body().requestReservation, 'Request Reservation defined')
  })
})
