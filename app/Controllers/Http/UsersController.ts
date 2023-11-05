import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import User from 'App/Models/User'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateAdressValidator from 'App/Validators/UpdateAdressValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import CrudUsersService from 'App/Services/Users/CrudUsersService'

const service = new CrudUsersService()

export default class UsersController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize('getUsers')
      const { text, ['user']: userId } = request.qs()

      const usersQuery = service.filterByQueryString(text, userId)
      const users = await usersQuery

      return response.ok({ users })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const route = request.url()

      const userPayload = await request.validate(CreateUserValidator)
      const addressPayload = await request.validate(CreateAddressValidator)

      if (route.includes('/users')) {
        const { user, address } = await service.createUser(userPayload, addressPayload)

        await this.auditLog(
          'CREATE USER',
          `User ${user.name} with e-mail: ${user.email} created in right-game.`,
          user.id
        )

        response.created({ user, address })
      } else if (route.includes('/owners')) {
        const { user, address } = await service.createOwner(userPayload, addressPayload)

        await this.auditLog(
          'CREATE USER',
          `Owner ${user.name} with e-mail: ${user.email} created in right-game.`,
          user.id
        )
        response.created({ user, address })
      }
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    try {
      const id = request.param('userId') as number

      await bouncer.authorize('updateUser', await User.findOrFail(id))

      const userPayload = await request.validate(UpdateUserValidator)
      const addressPayload = await request.validate(UpdateAdressValidator)

      const { user, address } = await service.updateUser(id, userPayload, addressPayload)

      await this.auditLog('UPDATE USER', `User ${user.name} updated their profile.`, user.id)
      response.ok({ user, address })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const id = request.param('userId') as number

      await bouncer.authorize('deleteUser', await User.findOrFail(id))
      const loggedUser = await auth.authenticate()

      const name = await service.deleteUser(id)

      await this.auditLog(
        'DELETE USER',
        `User ${loggedUser.name} deleted the user ${name}.`,
        loggedUser.id
      )

      response.ok({})
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }
}
