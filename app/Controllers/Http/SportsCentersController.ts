import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AuditLog from 'App/Models/AuditLog'
import SportsCenter from 'App/Models/SportsCenter'
import CrudSportsCentersService from 'App/Services/SportsCenters/CrudSportsCentersService'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import CreateSportsCenterValidator from 'App/Validators/CreateSportsCenterValidator'
import UpdateAdressValidator from 'App/Validators/UpdateAdressValidator'
import UpdateSportsCenterValidator from 'App/Validators/UpdateSportsCenterValidator'

const service = new CrudSportsCentersService()

export default class SportsCentersController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    try {
      const { text, ['sportsCenter']: sportsCenterId } = request.qs()
      const owner = request.param('ownerId') as number

      const sportsCenters = await service.filterByQueryString(text, sportsCenterId, owner)

      return response.ok({ sportsCenters })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      await bouncer.authorize('createSportsCenter')
      const user = await auth.authenticate()

      const sportsCenterPayload = await request.validate(CreateSportsCenterValidator)
      const addressPayload = await request.validate(CreateAddressValidator)

      const { sportsCenter, address } = await service.createSportsCenter(
        sportsCenterPayload,
        addressPayload,
        user
      )

      await this.auditLog(
        'CREATE SPORTSCENTER',
        `User ${user.name} created a new Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.created({ sportsCenter, address })
    } catch (error) {
      if (error.messages)
        response.status(error.status).send({ code: error.code, message: error.messages })
      else response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const id = request.param('sportsCenterId') as number

      await bouncer.authorize('manageSportsCenter', await SportsCenter.findOrFail(id))

      const sportsCenterPayload = await request.validate(UpdateSportsCenterValidator)
      const addressPayload = await request.validate(UpdateAdressValidator)

      const { sportsCenter, address } = await service.updateSportsCenter(
        id,
        sportsCenterPayload,
        addressPayload
      )

      await this.auditLog(
        'UPDATE SPORTSCENTER',
        `User ${user.name} update a Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.ok({ sportsCenter, address })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const id = request.param('sportsCenterId') as number

      await bouncer.authorize('manageSportsCenter', await SportsCenter.findOrFail(id))

      const sportsCenterName = await service.deleteSportsCenter(id)

      const user = await auth.authenticate()
      await this.auditLog(
        'DELETE SPORTSCENTER',
        `User ${user.name} delete a Sports Center: ${sportsCenterName}.`,
        user.id
      )

      response.ok({})
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }
}
