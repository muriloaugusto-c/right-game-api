import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import ReservationFactory from 'Database/factories/ReservationFactory'

import SportsCenterFactory from 'Database/factories/SportsCenterFactory'
import SportsCourtFactory from 'Database/factories/SportsCourtFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Reservations', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a reservation', async ({ client, assert }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ ownerId: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()

    const reservationPayload = {
      startTime: '2023-12-17 18:00:00',
      endTime: '2023-12-17 19:00:00',
      amount: '1510',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/reservations`)
      .json(reservationPayload)
      .loginAs(user2)

    response.assertStatus(201)
    assert.exists(response.body().reservation, 'Reservation undefined')
    assert.exists(response.body().reservation.id, 'ID Undefined')
    assert.equal(response.body().reservation.owner_id, user.id)
    assert.equal(response.body().reservation.sports_court_id, sportsCourt.id)
    assert.equal(response.body().reservation.user_id, user2.id)
  })

  test('it should return 403 when user is not of type USER', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ ownerId: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()

    const reservationPayload = {
      startTime: '2023-10-17 18:00:00',
      endTime: '2023-10-17 19:00:00',
      amount: '1510',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/reservations`)
      .json(reservationPayload)
      .loginAs(user)

    response.assertStatus(403)
    assert.equal(response.body().code, 'E_AUTHORIZATION_FAILURE')
  })

  test('it should return 409 when time interval is already reservate', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ ownerId: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()
    const reservation = await ReservationFactory.merge({
      status: 'CONFIRMED',
      sportsCourtId: sportsCourt.id,
    })
      .with('user')
      .with('owner')
      .create()

    const reservationPayload = {
      startTime: reservation.startTime.toFormat('yyyy-MM-dd HH:mm:ss'),
      endTime: reservation.endTime.toFormat('yyyy-MM-dd HH:mm:ss'),
      amount: '1510',
    }

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/reservations`)
      .json(reservationPayload)
      .loginAs(user2)

    response.assertStatus(409)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'Reservation Time is Already in use')
  })

  test('it should update a Reservation', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ ownerId: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()
    const reservation = await ReservationFactory.merge({
      userId: user2.id,
      ownerId: user.id,
      sportsCourtId: sportsCourt.id,
    }).create()

    const reservationPayload = {
      startTime: '2023-12-17 18:00:00',
      endTime: '2023-12-17 19:00:00',
    }

    const response = await client
      .put(`/reservations/${reservation.id}`)
      .json(reservationPayload)
      .loginAs(user2)

    response.assertStatus(200)
    assert.exists(response.body().reservation, 'Reservation undefined')
    assert.exists(response.body().reservation.id, 'ID Undefined')
    assert.equal(response.body().reservation.owner_id, user.id)
    assert.equal(response.body().reservation.sports_court_id, sportsCourt.id)
    assert.equal(response.body().reservation.user_id, user2.id)
  })

  test('it should delete a reservation', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ ownerId: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()
    const reservation = await ReservationFactory.merge({
      userId: user2.id,
      ownerId: user.id,
      sportsCourtId: sportsCourt.id,
    }).create()

    const response = await client.delete(`/reservations/${reservation.id}`).json({}).loginAs(user2)

    response.assertStatus(200)
    assert.notExists(response.body().reservation, 'Reservation defined')
  })

  test('it should return something', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ ownerId: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const user2 = await UserFactory.with('address', 1).create()

    const reservationPayload = {
      startTime: '2023-12-17 18:00:00',
      endTime: '2023-12-17 19:00:00',
      amount: '1510',
    }

    await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}/reservations`)
      .json(reservationPayload)
      .loginAs(user2)

    const response = await client.get(`/reservations/${user.id}`).json({}).loginAs(user)

    console.log(response.body())
  }).pin()
})
