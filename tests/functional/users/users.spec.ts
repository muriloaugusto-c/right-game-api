import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AddressFactory from 'Database/factories/AddressFactory'
import UserFactory from 'Database/factories/UserFactory'
import { DateTime } from 'luxon'

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

    const response = await client.put(`/users/${user.id}`).json(userPayload)

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

  test('it should delete an user', async ({ client, assert }) => {
    const address = await AddressFactory.create()
    const { id } = await UserFactory.merge({ addressId: address.id }).create()

    const response = await client.delete(`/users/${id}`).json({})

    response.assertStatus(200)
  })

  test('it should return 404 when provided an unexisting user for delete', async ({ client }) => {
    const address = await AddressFactory.create()
    await UserFactory.merge({ addressId: address.id }).create()

    const response = await client.delete(`/users/5`).json({})

    response.assertStatus(404)
  })
})
