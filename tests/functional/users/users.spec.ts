import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AddressFactory from 'Database/factories/AddressFactory'
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
      doc: '10546417906',
      password: 'senha123',
      birthday: '1998-05-08',
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
    assert.equal(response.body().user.birthday, userPayload.birthday)
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

  test('it should return 409 when e-mail is already in use', async ({ client }) => {
    const { id } = await AddressFactory.create()
    const { email } = await UserFactory.merge({ addressId: id }).create()

    const userPayload = {
      name: 'Murilo',
      email: email,
      doc: '10546417906',
      password: 'senha123',
      birthday: '1998-05-08',
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
  })

  test('it should return 409 when doc is already in use', async ({ client }) => {
    const { id } = await AddressFactory.create()
    const { doc } = await UserFactory.merge({ addressId: id }).create()

    const userPayload = {
      name: 'Murilo',
      email: 'murilo@gmail.com',
      doc: doc,
      password: 'senha123',
      birthday: '1998-05-08',
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
  })

  test('it should return 422 when data is not provided', async ({ client, assert }) => {
    const response = await client.post('/users').json({})
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })

  test('it should return 422 when providing an invalid email', async ({ assert, client }) => {
    const response = await client.post('/users').json({
      name: 'João',
      email: 'dasda@',
      doc: '12345678911',
      password: 'joao123',
      birthday: '1998-05-08',
      phoneNumber: '+554199999999',
      street: 'Rua agostinho merlin',
      streetNumber: 912,
      zipCode: '80330300',
      state: 'paraná',
      city: 'curitiba',
      neighborhood: 'portão',
    })
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
  })

  test('it should update an user', async ({ client, assert }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()

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
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()

    const response = await client.put(`/users/5`).json({}).loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the updated account', async ({
    client,
  }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()
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
    console.log(response.body())

    response.assertStatus(403)
  }).pin()

  test('it should delete an user', async ({ client, assert }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()

    const response = await client.delete(`/users/${user.id}`).json({}).loginAs(user)

    response.assertStatus(200)
  })

  test('it should return 404 when provided an unexisting user for delete', async ({ client }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()

    const response = await client.delete(`/users/5`).json({}).loginAs(user)

    response.assertStatus(404)
  })

  test('it should return 403 when the user is not the owner of the deleted account', async ({
    client,
  }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()
    const user2 = await UserFactory.create()

    const response = await client.delete(`/users/${user.id}`).json({}).loginAs(user2)

    response.assertStatus(403)
  })

  test('it should make an owner user', async ({ assert, client }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()
    const userAdmin = await UserFactory.merge({ type: 'ADMIN' }).create()

    const response = await client.put(`/users/${user.id}/owner`).json({}).loginAs(userAdmin)

    response.assertStatus(200)
    assert.exists(response.body().user, 'User undefined')
    assert.equal(response.body().user.type, 'OWNER')
  })

  test('it should return 403 when user is not admin', async ({ assert, client }) => {
    const address = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: address.id }).create()
    const user2 = await UserFactory.create()

    const response = await client.put(`/users/${user.id}/owner`).json({}).loginAs(user2)

    response.assertStatus(403)
  })
})
