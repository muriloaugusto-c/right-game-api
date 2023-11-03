import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import SportsCenterFactory from 'Database/factories/SportsCenterFactory'
import SportsCourtFactory from 'Database/factories/SportsCourtFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('SportsCourts', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a Sports Court', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()

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
      .loginAs(user)

    response.assertStatus(201)
    assert.exists(response.body().sportsCourt, 'Sports Court Undefined')
    assert.exists(response.body().sportsCourt.id, 'ID Undefined')
    assert.equal(response.body().sportsCourt.name, sportsCourtPayload.name)
    assert.equal(response.body().sportsCourt.modality, sportsCourtPayload.modality)
    assert.equal(response.body().sportsCourt.description, sportsCourtPayload.description)
    assert.equal(response.body().sportsCourt.size, sportsCourtPayload.size)
    assert.equal(response.body().sportsCourt.photo_urls, sportsCourtPayload.photoUrls)
  })

  test('it should return 403 when user is not owner', async ({ client }) => {
    const user = await UserFactory.with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()

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
      .loginAs(user)

    response.assertStatus(403)
  })

  test('it should return 422 when data is not provided', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()

    const response = await client
      .post(`/sportsCenters/${sportsCenter.id}/sportsCourts`)
      .json({})
      .loginAs(user)

    assert.equal(response.body().code, 'E_VALIDATION_FAILURE')
    response.assertStatus(422)
  })

  test('it should update a Sports Court', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()

    const sportsCourtPayload = {
      name: 'Quadra do Tio Zé',
      description: 'Quadra do Tiozão',
    }

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}`)
      .json(sportsCourtPayload)
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().sportsCourt, 'Sports Courts Undefined')
    assert.exists(response.body().sportsCourt.id, 'ID Undefined')
    assert.equal(response.body().sportsCourt.name, sportsCourtPayload.name)
    assert.equal(response.body().sportsCourt.description, sportsCourtPayload.description)
    assert.equal(response.body().sportsCourt.photo_urls, sportsCourt.photoUrls)
    assert.equal(response.body().sportsCourt.modality, sportsCourt.modality)
    assert.equal(response.body().sportsCourt.size, sportsCourt.size)
  })

  test('it should return 404 when provided an unexisting sports court for update', async ({
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/sportsCourts/3`)
      .json({})
      .loginAs(user)
    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the updated sports courts', async ({
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const owner = await UserFactory.merge({ type: 'OWNER' }).create()

    const response = await client
      .put(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}`)
      .loginAs(owner)

    response.assertStatus(403)
  })

  test('it should delete a Sports Court', async ({ client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}`)
      .json({})
      .loginAs(user)

    response.assertStatus(200)
  })

  test('it should return 404 when provided an unexisting sports court for delete', async ({
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}/sportsCourts/5`)
      .json({})
      .loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the sports court', async ({
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const owner = await UserFactory.merge({ type: 'OWNER' }).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()

    const response = await client
      .delete(`/sportsCenters/${sportsCenter.id}/sportsCourts/${sportsCourt.id}`)
      .json({})
      .loginAs(owner)

    response.assertStatus(403)
  })

  test('it should return all sports courts by sports center when no query is provided to sports court', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const sportsCourt2 = await SportsCourtFactory.merge({
      sportsCenterId: sportsCenter.id,
    }).create()

    const response = await client.get(`/sportsCenters/${sportsCenter.id}/sportsCourts`).json({})

    response.assertStatus(200)
    assert.exists(response.body().sportsCourts, 'Sports Centers undefined')
    assert.equal(response.body().sportsCourts[0].id, sportsCourt.id)
    assert.equal(response.body().sportsCourts[1].id, sportsCourt2.id)
    assert.equal(response.body().sportsCourts[0].name, sportsCourt.name)
    assert.equal(response.body().sportsCourts[1].name, sportsCourt2.name)
  })

  test('it should return all sports courts at sports center when no query is provided to sports court', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    const sportsCourt2 = await SportsCourtFactory.merge({
      sportsCenterId: sportsCenter.id,
    }).create()

    const response = await client.get(`/sportsCenters/${sportsCenter.id}/sportsCourts`).json({})

    response.assertStatus(200)
    assert.exists(response.body().sportsCourts, 'Sports Centers undefined')
    assert.equal(response.body().sportsCourts[0].id, sportsCourt.id)
    assert.equal(response.body().sportsCourts[1].id, sportsCourt2.id)
    assert.equal(response.body().sportsCourts[0].name, sportsCourt.name)
    assert.equal(response.body().sportsCourts[1].name, sportsCourt2.name)
  })

  test('it should return all sports courts at sports center by name', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    await SportsCourtFactory.merge({
      sportsCenterId: sportsCenter.id,
    }).create()

    const response = await client
      .get(`/sportsCenters/${sportsCenter.id}/sportsCourts?text=${sportsCourt.name}`)
      .json({})

    response.assertStatus(200)
    assert.exists(response.body().sportsCourts, 'Sports Centers undefined')
    assert.equal(response.body().sportsCourts[0].id, sportsCourt.id)
    assert.equal(response.body().sportsCourts[0].name, sportsCourt.name)
  })

  test('it should return all sports courts at sports center by description', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    await SportsCourtFactory.merge({
      sportsCenterId: sportsCenter.id,
    }).create()

    const response = await client
      .get(`/sportsCenters/${sportsCenter.id}/sportsCourts?text=${sportsCourt.description}`)
      .json({})

    response.assertStatus(200)
    assert.exists(response.body().sportsCourts, 'Sports Centers undefined')
    assert.equal(response.body().sportsCourts[0].id, sportsCourt.id)
    assert.equal(response.body().sportsCourts[0].name, sportsCourt.name)
    assert.equal(response.body().sportsCourts[0].description, sportsCourt.description)
  })

  test('it should return all sports courts at sports center by id', async ({ assert, client }) => {
    const user = await UserFactory.merge({ type: 'OWNER' }).with('address', 1).create()
    const sportsCenter = await SportsCenterFactory.merge({ owner: user.id })
      .with('address', 1)
      .create()
    const sportsCourt = await SportsCourtFactory.merge({ sportsCenterId: sportsCenter.id }).create()
    await SportsCourtFactory.merge({
      sportsCenterId: sportsCenter.id,
    }).create()

    const response = await client
      .get(`/sportsCenters/${sportsCenter.id}/sportsCourts?sportsCourtId=${sportsCourt.id}`)
      .json({})

    response.assertStatus(200)
    assert.exists(response.body().sportsCourts, 'Sports Centers undefined')
    assert.equal(response.body().sportsCourts[0].id, sportsCourt.id)
    assert.equal(response.body().sportsCourts[0].name, sportsCourt.name)
    assert.equal(response.body().sportsCourts[0].description, sportsCourt.description)
  })
})
