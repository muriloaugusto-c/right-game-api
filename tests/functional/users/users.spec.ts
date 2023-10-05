import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

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
    console.log(typeof response.body().user.casa)
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

  test('it should return 422 when e-mail is already in use', async ({ client }) => {})
})
