import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { SportsCourtFactory, UserFactory } from 'Database/factories'

test.group('Sports Court', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a Sports Court', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const sportsCourtPayload = {
      name: 'Quadra do Tio Zé',
      description: 'Quadra de Futsal',
      location: 'Endereço x x x',
      owner: user.id,
    }

    const response = await client.post('/sportsCourt').json(sportsCourtPayload).loginAs(user)

    assert.exists(response.body().sportsCourt, 'Sports Court undefined')
    response.assertBodyContains({ sportsCourt: sportsCourtPayload })
    response.assertStatus(201)
  })

  test('it should return 422 when provided data is not provided', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const response = await client.post('/sportsCourt').json({}).loginAs(user)
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })

  test('it should update a Sports Court', async ({ assert, client }) => {
    const user = await UserFactory.create()

    const sportsCourtPayload = {
      name: 'Quadra do Tio Zé',
      description: 'Quadra de Futsal',
      location: 'Endereço x x x',
      owner: user.id,
    }

    let response = await client.post('/sportsCourt').json(sportsCourtPayload).loginAs(user)

    const sportsCourtId = response.body().sportsCourt.id

    const updatedSportsCourt = {
      name: 'Quadra do Tio João',
      description: 'Quadra de Volei',
      location: 'Endereço x x x x',
    }

    response = await client
      .patch(`/sportsCourt/${sportsCourtId}`)
      .json(updatedSportsCourt)
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().sportsCourt, 'Sports Court undefined')
    response.assertBodyContains({ sportsCourt: updatedSportsCourt })
  })

  test('it should return 404 when provided an unexisting sports court for update', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.create()

    const response = await client.patch(`/sportsCourt/5`).json({}).loginAs(user)

    response.assertStatus(404)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'the requested resource was not found')
  })

  test('it should delete a sports court', async ({ client }) => {
    const user = await UserFactory.create()

    const sportsCourtPayload = {
      name: 'Quadra do Tio Zé',
      description: 'Quadra de Futsal',
      location: 'Endereço x x x',
      owner: user.id,
    }

    let response = await client.post('/sportsCourt').json(sportsCourtPayload).loginAs(user)

    const sportsCourtId = response.body().sportsCourt.id

    response = await client.delete(`/sportsCourt/${sportsCourtId}`).loginAs(user)

    response.assertStatus(200)
  })

  test('it should return 404 when provided an unexisting sports court for update', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    const response = await client.delete(`/sportsCourt/1`).loginAs(user)

    response.assertStatus(404)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'the requested resource was not found')
  })

  test('it should return all sports courts', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const sportsCourt = await SportsCourtFactory.merge({ owner: user.id }).create()
    const sportsCourt2 = await SportsCourtFactory.merge({ owner: user.id }).create()

    const response = await client.get('/sportsCourt')

    response.assertStatus(200)
    assert.exists(response.body().sportsCourts, 'Sports Courts undefined')
    assert.equal(response.body().sportsCourts.length, 2)
    assert.equal(response.body().sportsCourts[0].name, sportsCourt.name)
    assert.equal(response.body().sportsCourts[1].name, sportsCourt2.name)
  })
})
