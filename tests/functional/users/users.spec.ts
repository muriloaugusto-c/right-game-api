import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import { UserWithAddressFactory } from 'Database/factories'
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

    console.log(response.body().address.id + ` ADRESS ID  ` + response.body().user.addressId)
    assert.equal(response.body().address.id, response.body().user.addressId)
    response.assertStatus(201)
  }).pin()

  test('it should return 422 when e-mail is already in use', async ({ client }) => {
    const { id } = await AddressFactory.create()
    const user = await UserFactory.merge({ addressId: id }).create()

    console.log(user)

    //const response = await client.post('/users').json({ user, address })
    //response.assertStatus(201)
  })
})
