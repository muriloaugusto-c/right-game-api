/*
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Session', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should authenticate an user', async ({ assert, client }) => {
    const plainPassword = 'test'
    const { id, email } = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client.post('/sessions').json({
      email: email,
      password: plainPassword,
    })

    response.assertStatus(201)
    assert.exists(response.body().user, 'User undefined')
    assert.equal(response.body().user.id, id)
  })

  test('it should return an api token when session is created', async ({ assert, client }) => {
    const plainPassword = 'test'
    const { id, email } = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client.post('/sessions').json({
      email: email,
      password: plainPassword,
    })

    response.assertStatus(201)
    assert.exists(response.body().token, 'Token undefined')
    assert.equal(response.body().user.id, id)
  })

  test('it should return 400 when credentials are not provided', async ({ assert, client }) => {
    const response = await client.post('/sessions').json({})

    response.assertStatus(400)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })

  test('it should return 400 when credentials are invalid', async ({ assert, client }) => {
    const { email } = await UserFactory.create()
    const response = await client.post('/sessions').json({
      email,
      password: 'teste1234',
    })

    response.assertStatus(400)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'invalid credentials')
  })

  test('it should return 400 when credentials are invalid', async ({ assert, client }) => {
    const plainPassword = '123456'
    await UserFactory.merge({ password: plainPassword }).create()
    const response = await client.post('/sessions').json({
      email: 'test@test.com',
      password: plainPassword,
    })

    response.assertStatus(400)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'invalid credentials')
  })

  test('it should return 200 when user signs out', async ({ assert, client }) => {
    const plainPassword = 'test'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    let response = await client.post('/sessions').json({
      email: user.email,
      password: plainPassword,
    })

    const apiToken = response.body().token.token

    response = await client.delete('/sessions').json({}).loginAs(user)

    response.assertStatus(200)

    const token = await Database.query().select('*').from('api_tokens').where('token', apiToken)
    assert.isEmpty(token)
  })
})
