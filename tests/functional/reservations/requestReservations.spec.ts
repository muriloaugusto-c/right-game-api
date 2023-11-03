import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
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
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()

    const requestReservationPayload = {
      startTime: '2023-10-17 18:00:00',
      endTime: '2023-10-17 19:00:00',
      amount: '1510',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/requestReservations`)
      .json(requestReservationPayload)
      .loginAs(user2)

    response.assertStatus(201)
    assert.exists(response.body().requestReservation, 'Request Reservation undefined')
    assert.exists(response.body().requestReservation.id, 'ID Undefined')
    assert.equal(response.body().requestReservation.owner_id, user.id)
    assert.equal(response.body().requestReservation.sports_court_id, sportsCourt.id)
    assert.equal(response.body().requestReservation.user_id, user2.id)
  })

  test('it should return 403 when user is not USER', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()

    const requestReservationPayload = {
      startTime: '2023-10-17 18:00:00',
      endTime: '2023-10-17 19:00:00',
      amount: '1510',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/requestReservations`)
      .json(requestReservationPayload)
      .loginAs(user)

    response.assertStatus(403)
    assert.equal(response.body().code, 'E_AUTHORIZATION_FAILURE')
  })

  test('it should return 409 when time interval  is already reservate', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()
    const reservation = await RequestReservationFactory.merge({
      status: 'ACCEPTED',
      sportsCourtId: sportsCourt.id,
    })
      .with('user')
      .with('owner')
      .create()

    console.log(reservation.startTime)
    const requestReservationPayload = {
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      amount: '1510',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/requestReservations`)
      .json(requestReservationPayload)
      .loginAs(user2)

    console.log(response.body().message)
    response.assertStatus(409)
  })

  test('it should update a request Reservation', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()
    const requestReservation = await RequestReservationFactory.merge({
      userId: user2.id,
      ownerId: user.id,
      sportsCourtId: sportsCourt.id,
    }).create()

    const requestReservationPayload = {
      startTime: '2023-10-17 18:00:00',
      endTime: '2023-10-17 19:00:00',
    }

    const response = await client
      .put(`/requestReservations/${requestReservation.id}`)
      .json(requestReservationPayload)
      .loginAs(user2)

    response.assertStatus(200)
    assert.exists(response.body().requestReservation, 'Request Reservation undefined')
    assert.exists(response.body().requestReservation.id, 'ID Undefined')
    assert.equal(response.body().requestReservation.owner_id, user.id)
    assert.equal(response.body().requestReservation.sports_court_id, sportsCourt.id)
    assert.equal(response.body().requestReservation.user_id, user2.id)
  })

  test('it should delete a request reservation', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()
    const requestReservation = await RequestReservationFactory.merge({
      userId: user2.id,
      ownerId: user.id,
      sportsCourtId: sportsCourt.id,
    }).create()

    const response = await client
      .delete(`/requestReservations/${requestReservation.id}`)
      .json({})
      .loginAs(user2)

    response.assertStatus(200)
    assert.notExists(response.body().requestReservation, 'Request Reservation defined')
  })
})
