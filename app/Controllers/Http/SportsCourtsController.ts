import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import SportsCenter from 'App/Models/SportsCenter'

import CrudSportsCourtsService from 'App/Services/SportsCourts/CrudSportsCourtsService'
import CreateSportsCourtValidator from 'App/Validators/CreateSportsCourtValidator'
import UptadeSportsCourtValidator from 'App/Validators/UptadeSportsCourtValidator'

const service = new CrudSportsCourtsService()

export default class SportsCourtsController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    try {
      const { text, ['sportsCourt']: sportsCourtId } = request.qs()
      const sportsCenterId = request.param('sportsCenterId') as number

      const sportsCourts = await service.filterByQueryString(text, sportsCenterId, sportsCourtId)

      return response.ok({ sportsCourts })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const sportsCenterId = request.param('sportsCenterId') as number
      const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

      await bouncer.authorize('manageSportsCenter', sportsCenter)
      const sportsCourtPayload = await request.validate(CreateSportsCourtValidator)

      const sportsCourt = await service.createSportsCourts(sportsCenter, sportsCourtPayload)

      await this.auditLog(
        'CREATE SPORTSCOURT',
        `User ${user.name} create a Sports Court: ${sportsCourt.name} at Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.created({ sportsCourt })
    } catch (error) {
      if (error.messages)
        response.status(error.status).send({ code: error.code, message: error.messages })
      else response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const sportsCenterId = request.param('sportsCenterId') as number
      const sportsCourtId = request.param('sportsCourtId') as number
      const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

      await bouncer.authorize('manageSportsCenter', sportsCenter)

      const sportsCourtPayload = await request.validate(UptadeSportsCourtValidator)
      const sportsCourt = await service.updateSportsCourts(sportsCourtId, sportsCourtPayload)

      await this.auditLog(
        'UPDATE SPORTSCOURT',
        `User ${user.name} update a Sports Court: ${sportsCourt.name} at Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.ok({ sportsCourt })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const sportsCenterId = request.param('sportsCenterId') as number
      const sportsCourtId = request.param('sportsCourtId') as number
      const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

      await bouncer.authorize('manageSportsCenter', sportsCenter)

      const sportsCourtName = await service.deleteSportsCourts(sportsCourtId)

      await this.auditLog(
        'DELETE SPORTSCOURT',
        `User ${user.name} delete a Sports Court: ${sportsCourtName} at Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.ok({})
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }
}
