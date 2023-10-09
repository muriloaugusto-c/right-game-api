import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import Address from 'App/Models/Address'
import User from 'App/Models/User'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateAdressValidator from 'App/Validators/UpdateAdressValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const { text, ['user']: userId } = request.qs()

    const usersQuery = this.filterByQueryString(text, userId)
    const users = await usersQuery

    return response.ok({ users })
  }

  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)
    const addressPayload = await request.validate(CreateAddressValidator)

    const userByEmail = await User.findBy('email', userPayload.email)
    const userByDoc = await User.findBy('doc', userPayload.doc)

    if (userByEmail) throw new BadRequest('email is already in use', 409)
    if (userByDoc) throw new BadRequest('doc is already in use', 409)

    const user = await User.create(userPayload)
    const address = await Address.create(addressPayload)

    await address.related('user').save(user)
    await user.merge({ addressId: address.id }).save()

    response.created({ user, address })
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('userId') as number
    const userPayload = await request.validate(UpdateUserValidator)
    const addressPayload = await request.validate(UpdateAdressValidator)

    const user = await User.findOrFail(id)
    const updatedUser = await user.merge(userPayload).save()

    const addressId = user.addressId

    const address = await Address.findOrFail(addressId)
    const updatedAddress = await address.merge(addressPayload).save()

    response.ok({ user: updatedUser, address: updatedAddress })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('userId') as number
    const user = await User.findOrFail(id)

    await user.delete()

    response.ok({})
  }

  private filterByQueryString(text: string, userId: number) {
    if (userId) return this.filterByUser(userId)
    else if (text) return this.filterbyText(text)
    else return this.all()
  }

  private all() {
    return User.query().preload('address')
  }

  private filterByUser(userId: number) {
    return User.query()
      .preload('address')
      .withScopes((scope) => scope.withId(userId))
  }

  private filterbyText(text: string) {
    return User.query()
      .preload('address')
      .withScopes((scope) => scope.withText(text))
  }
}
