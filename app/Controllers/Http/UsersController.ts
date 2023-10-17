import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address'
import AuditLog from 'App/Models/AuditLog'
import User from 'App/Models/User'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateAdressValidator from 'App/Validators/UpdateAdressValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('getUsers')
    const { text, ['user']: userId } = request.qs()

    const usersQuery = this.filterByQueryString(text, userId)
    const users = await usersQuery

    return response.ok({ users })
  }

  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)
    const addressPayload = await request.validate(CreateAddressValidator)

    const user = await User.create(userPayload)
    const address = await Address.create(addressPayload)

    await address.related('user').save(user)
    await user.merge({ addressId: address.id }).save()

    await this.auditLog(
      'CREATE USER',
      `User ${user.name} with e-mail: ${user.email} created in right-game.`,
      user.id
    )

    response.created({ user, address })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('userId') as number
    const userPayload = await request.validate(UpdateUserValidator)
    const addressPayload = await request.validate(UpdateAdressValidator)

    const user = await User.findOrFail(id)

    await bouncer.authorize('updateUser', user)

    const updatedUser = await user.merge(userPayload).save()

    const addressId = user.addressId

    const address = await Address.findOrFail(addressId)
    const updatedAddress = await address.merge(addressPayload).save()

    await this.auditLog('UPDATE USER', `User ${user.name} updated their profile.`, user.id)

    response.ok({ user: updatedUser, address: updatedAddress })
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    const id = request.param('userId') as number

    const user = await User.findOrFail(id)
    const address = await Address.findOrFail(user.addressId)

    const loggedUser = await auth.authenticate()
    await bouncer.authorize('deleteUser', user)

    await AuditLog.query().where('user_id', user.id).delete()
    await user.delete()
    await address.delete()

    await this.auditLog(
      'DELETE USER',
      `User ${loggedUser.name} deleted the user ${user.name}.`,
      loggedUser.id
    )

    response.ok({})
  }

  public async makeOwner({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('userId') as number
    const user = await User.findOrFail(id)

    await bouncer.authorize('makeOnwer')

    const updateUser = await user.merge({ type: 'OWNER' }).save()

    response.ok({ user: updateUser })
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
