import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only([
      'name',
      'email',
      'password',
      'birthday',
      'doc',
      'phoneNumber',
    ])

    const addressPayload = request.only([
      'street',
      'streetNumber',
      'zipCode',
      'state',
      'city',
      'neighborhood',
    ])

    const user = await User.create(userPayload)
    const address = await Address.create(addressPayload)
    await address.related('user').save(user)

    response.created({ user, address })
  }
}
