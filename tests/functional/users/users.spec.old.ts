/*
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import { DateTime } from 'luxon'

test.group('User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user', async ({ assert, client }) => {
    const userPayload = {
      name: 'João',
      email: 'joão@gmail.com',
      cpf: 10546417906,
      password: 'joao123',
      birthday: DateTime.fromFormat('08-05-1998', 'dd-MM-yyyy').toISODate(),
      phoneNumber: '+554199999999',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }
    const response = await client.post('/users').json(userPayload)

    const { phoneNumber, birthday, password, ...expected } = userPayload

    response.assertStatus(201)
    assert.exists(response.body().user, 'User undefined')
    assert.exists(response.body().user.id, 'Id undefined')
    assert.equal(response.body().user.email, userPayload.email)
    assert.equal(response.body().user.cpf, userPayload.cpf)
    assert.equal(response.body().user.birthday, birthday)
    assert.equal(response.body().user.phone_number, phoneNumber)
    assert.notExists(response.body().user.password, 'Password defined')
    response.assertBodyContains({ user: expected })
  })

  test('it should return 409 when email is already in use', async ({ assert, client }) => {
    const { email } = await UserFactory.create()
    const response = await client.post('/users').json({
      name: 'João',
      email: email,
      cpf: 10546417906,
      password: 'joao123',
      birthday: DateTime.fromFormat('08-05-1998', 'dd-MM-yyyy').toISODate(),
      phoneNumber: '+554199999999',
    })

    assert.include(response.body().message, 'email')
    assert.exists(response.body().message)
    assert.equal(response.body().code, 'BAD_REQUEST')
    response.assertStatus(409)
  })

  test('it should return 409 when cpf is already in use', async ({ assert, client }) => {
    const { cpf } = await UserFactory.create()
    const response = await client.post('/users').json({
      name: 'João',
      email: 'joao@joão.com',
      cpf: cpf,
      password: 'joao123',
      birthday: DateTime.fromFormat('08-05-1998', 'dd-MM-yyyy').toISODate(),
      phoneNumber: '+554199999999',
    })

    assert.include(response.body().message, 'cpf')
    assert.exists(response.body().message)
    assert.equal(response.body().code, 'BAD_REQUEST')
    response.assertStatus(409)
  })

  test('it should return 422 when required data is not provided', async ({ assert, client }) => {
    const response = await client.post('/users').json({})
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })

  test('it should return 422 when providing an invalid email', async ({ assert, client }) => {
    const response = await client.post('/users').json({
      name: 'João',
      email: 'dasda@',
      cpf: 12345678911,
      password: 'joao123',
      birthday: DateTime.fromFormat('08-05-1998', 'dd-MM-yyyy').toISODate(),
      phoneNumber: '+554199999999',
    })
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })

  test('it should return 422 when providing an invalid password', async ({ assert, client }) => {
    const response = await client.post('/users').json({
      name: 'João',
      email: 'dasda@com.br',
      cpf: 12345678911,
      password: 'joa',
      birthday: DateTime.fromFormat('08-05-1998', 'dd-MM-yyyy').toISODate(),
      phoneNumber: '+554199999999',
    })
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })

  test('it should update an user', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const email = 'test@test.com'

    const response = await client
      .put(`/users/${user.id}`)
      .json({
        email,
        password: user.password,
      })
      .loginAs(user)

    response.assertStatus(200)
    assert.exists(response.body().user, 'User undefined')
    assert.equal(response.body().user.id, user.id)
    assert.equal(response.body().user.email, email)
  })

  test('it should update the password of the user', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const password = 'test'

    const response = await client
      .put(`/users/${user.id}`)
      .json({
        email: user.email,
        password: password,
      })
      .loginAs(user)

    response.assertStatus(200)

    assert.exists(response.body().user, 'User undefined')
    assert.equal(response.body().user.id, user.id)
    assert.equal(response.body().user.email, user.email)

    await user.refresh()

    assert.isTrue(await Hash.verify(user.password, password))
  })

  test('it should return 422 when provided data is not provided', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.put(`/users/${user.id}`).json({}).loginAs(user)

    response.assertStatus(422)
    response.assertBodyContains({ code: 'BAD_REQUEST' })
  })

  test('it should return 422 when providing an invalid password', async ({ client }) => {
    const user = await UserFactory.create()
    const password = '125'
    const response = await client
      .put(`/users/${user.id}`)
      .json({
        email: user.password,
        password,
      })
      .loginAs(user)

    response.assertStatus(422)
    response.assertBodyContains({ code: 'BAD_REQUEST' })
  })
})
