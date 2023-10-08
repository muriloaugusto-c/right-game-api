import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address'
import User from 'App/Models/User'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)

    const addressPayload = await request.validate(CreateAddressValidator)

    //CRIAR USUÁRIO E ENDEREÇO E RELATIONAR AMBOS
    const user = await User.create(userPayload)
    const address = await Address.create(addressPayload)

    await address.related('user').save(user)
    await user.merge({ addressId: address.id }).save()

    response.created({ user, address })
  }
}
