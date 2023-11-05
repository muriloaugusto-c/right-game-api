import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'

test.group('User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user', async ({ assert, client }) => {
    const userPayload = {
      name: 'Murilo',
      email: 'murilo@gmail.com',
      doc: '105.464.179-06',
      password: 'senha123',
      birthdate: '1998-05-08',
      phoneNumber: '+55 41 99651 0644',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.post('/users').json(userPayload)

    assert.exists(response.body().user, 'User undefined')
    assert.exists(response.body().user.id, 'Id undefined')
    assert.equal(response.body().user.name, userPayload.name)
    assert.equal(response.body().user.email, userPayload.email)
    assert.equal(response.body().user.doc, userPayload.doc)
    assert.equal(response.body().user.birthdate, userPayload.birthdate)
    assert.equal(response.body().user.phone_number, userPayload.phoneNumber)
    assert.notExists(response.body().user.password, 'Password defined')
    assert.equal(response.body().address.street, userPayload.street)
    assert.equal(response.body().address.street_number, userPayload.streetNumber)
    assert.equal(response.body().address.zip_code, userPayload.zipCode)
    assert.equal(response.body().address.state, userPayload.state)
    assert.equal(response.body().address.city, userPayload.city)
    assert.equal(response.body().address.neighborhood, userPayload.neighborhood)
    response.assertStatus(201)
  })

  test('it should return 422 when data is not provided', async ({ client, assert }) => {
    const response = await client.post('/users').json({})

    response.assertStatus(422)

    assert.equal(response.body().code, 'E_VALIDATION_FAILURE')
  })

  test('it should return 409 when doc is not valid', async ({ assert, client }) => {
    const userPayload = {
      name: 'Murilo',
      email: 'murilo@gmail.com',
      doc: '105.464.179-09',
      password: 'senha123',
      birthdate: '1998-05-08',
      phoneNumber: '+55 41 99651 0644',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.post('/users').json(userPayload)

    response.assertStatus(409)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'CPF invalid')
  })

  test('it should return 422 when providing an invalid email', async ({ assert, client }) => {
    const response = await client.post('/users').json({
      name: 'João',
      email: 'dasda@',
      doc: '12345678911',
      password: 'joao123',
      birthdate: '1998-05-08',
      phoneNumber: '+554199999999',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    })

    response.assertStatus(422)
    assert.equal(response.body().code, 'E_VALIDATION_FAILURE')
  })

  test('it should return 409 when e-mail is already in use', async ({ assert, client }) => {
    const user = await UserFactory.create()

    const userPayload = {
      name: 'Murilo',
      email: user.email,
      doc: '10546417906',
      password: 'senha123',
      birthdate: '1998-05-08',
      phoneNumber: '+55 41 99651 0644',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.post('/users').json(userPayload)

    response.assertStatus(409)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'Email is already in use')
  })

  test('it should return 409 when doc is already in use', async ({ assert, client }) => {
    const user = await UserFactory.create()

    const userPayload = {
      name: 'Murilo',
      email: 'murilo@gmail.com',
      doc: user.doc,
      password: 'senha123',
      birthdate: '1998-05-08',
      phoneNumber: '+55 41 99651 0644',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.post('/users').json(userPayload)

    response.assertStatus(409)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().message, 'Doc is already in use')
  })

  test('it should update an user', async ({ client, assert }) => {
    const user = await UserFactory.with('address', 1).create()

    const userPayload = {
      name: 'Murilo',
      phoneNumber: '+55 41 99651 0644',
      street: 'Augusto de Mari',
      streetNumber: 155,
      zipCode: '2111',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.put(`/users/${user.id}`).json(userPayload).loginAs(user)

    assert.exists(response.body().user, 'User undefined')
    assert.exists(response.body().user.id, 'Id undefined')
    assert.equal(response.body().user.name, userPayload.name)
    assert.equal(response.body().user.phone_number, userPayload.phoneNumber)
    assert.equal(response.body().address.street, userPayload.street)
    assert.equal(response.body().address.street_number, userPayload.streetNumber)
    assert.equal(response.body().address.zip_code, userPayload.zipCode)
    assert.equal(response.body().address.state, userPayload.state)
    assert.equal(response.body().address.city, userPayload.city)
    assert.equal(response.body().address.neighborhood, userPayload.neighborhood)
    response.assertStatus(200)
  })

  test('it should return 404 when provided an unexisting user for update', async ({ client }) => {
    const user = await UserFactory.with('address', 1).create()

    const response = await client.put(`/users/41234`).json({}).loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the updated account', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.create()
    const user2 = await UserFactory.create()

    const userPayload = {
      name: 'Murilo',
      phoneNumber: '+55 41 99651 0644',
      street: 'Augusto de Mari',
      streetNumber: 155,
      zipCode: '2111',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    }

    const response = await client.put(`/users/${user.id}`).json(userPayload).loginAs(user2)

    response.assertStatus(403)
    assert.equal(response.body().code, 'E_AUTHORIZATION_FAILURE')
    assert.equal(
      response.body().message,
      'E_AUTHORIZATION_FAILURE: Not authorized to perform this action'
    )
  })

  test('it should delete an user', async ({ client }) => {
    const user = await UserFactory.with('address', 1).create()
    const admin = await UserFactory.apply('admin').create()

    const response = await client.delete(`/users/${user.id}`).json({}).loginAs(admin)

    response.assertStatus(200)
  })

  test('it should return 404 when provided an unexisting user for delete', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.delete(`/users/5`).json({}).loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner or admin of the deleted account', async ({
    client,
  }) => {
    const user = await UserFactory.create()
    const user2 = await UserFactory.create()

    const response = await client.delete(`/users/${user.id}`).json({}).loginAs(user2)

    response.assertStatus(403)
  })

  test('it should return all users when no query is provided to users', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.with('address', 1).create()
    const user2 = await UserFactory.with('address', 1).create()
    const admin = await UserFactory.apply('admin').create()

    const response = await client.get('/users').json({}).loginAs(admin)

    response.assertStatus(200)
    assert.exists(response.body().users, 'User undefined')
    assert.equal(response.body().users[0].id, user.id)
    assert.equal(response.body().users[1].id, user2.id)
    assert.equal(response.body().users[0].name, user.name)
    assert.equal(response.body().users[1].name, user2.name)
  })

  test('it should return 403 when user is not admin', async ({ client }) => {
    const user = await UserFactory.with('address', 1).create()

    const response = await client.get('/users').json({}).loginAs(user)

    response.assertStatus(403)
  })

  test('it should return user by user id', async ({ assert, client }) => {
    const user = await UserFactory.with('address', 1).create()
    await UserFactory.with('address', 1).create()
    const admin = await UserFactory.apply('admin').create()

    const response = await client.get(`/users?user=${user.id}`).json({}).loginAs(admin)

    response.assertStatus(200)
    assert.exists(response.body().users, 'User undefined')
    assert.equal(response.body().users[0].id, user.id)
    assert.equal(response.body().users[0].name, user.name)
  })

  test('it should return user by user name', async ({ assert, client }) => {
    const user = await UserFactory.with('address', 1).create()
    await UserFactory.with('address', 1).create()
    const admin = await UserFactory.apply('admin').create()

    const response = await client.get(`/users?text=${user.name}`).json({}).loginAs(admin)

    response.assertStatus(200)
    assert.exists(response.body().users, 'User undefined')
    assert.equal(response.body().users[0].id, user.id)
    assert.equal(response.body().users[0].name, user.name)
  })

  test('it should return no user by user name not found', async ({ assert, client }) => {
    await UserFactory.with('address', 1).createMany(5)
    const admin = await UserFactory.apply('admin').create()

    const response = await client.get(`/users?text=pedro`).json({}).loginAs(admin)

    response.assertStatus(200)
    assert.empty(response.body().users)
  })
})
