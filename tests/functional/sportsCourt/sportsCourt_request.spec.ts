/*
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { SportsCourtFactory, UserFactory } from 'Database/factories'

test.group('Sports Court Request', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a sports court request', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const sportsCourt = await SportsCourtFactory.merge({ owner: user.id }).create()
    const reservationTime = '14:30:00'

    const response = await client
      .post(`/sportsCourt/${sportsCourt.id}/requests`)
      .json({ reservationTime })
      .loginAs(user)

    response.assertStatus(201)
    assert.equal(response.body().sportsCourtRequest.userId, user.id)
    assert.equal(response.body().sportsCourtRequest.sportsCourtId, sportsCourt.id)
    assert.equal(response.body().sportsCourtRequest.status, 'PENDING')
  })

  test('it should return 409 when sports court request', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const sportsCourt = await SportsCourtFactory.merge({ owner: user.id }).create()
    const reservationTime = '14:30:00'

    await client
      .post(`/sportsCourt/${sportsCourt.id}/requests`)
      .json({ reservationTime })
      .loginAs(user)

    const response = await client
      .post(`/sportsCourt/${sportsCourt.id}/requests`)
      .json({ reservationTime })
      .loginAs(user)

    response.assertStatus(409)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })
})

*/
