import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUser)

    const userByEmail = await User.findBy('email', userPayload.email)
    const userByCpf = await User.findBy('cpf', userPayload.cpf)

    if (userByEmail) throw new BadRequest('email is already in use', 409)
    if (userByCpf) throw new BadRequest('cpf is already in use', 409)

    const user = await User.create(userPayload)
    response.created({ user })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { email, password } = await request.validate(UpdateUser)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    await bouncer.authorize('updateUser', user)

    user.email = email
    user.password = password

    await user.save()

    response.ok({ user })
  }
}
