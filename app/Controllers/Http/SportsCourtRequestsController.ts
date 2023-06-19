import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'

import SportsCourtRequest from 'App/Models/SportsCourtRequest'
import { DateTime } from 'luxon'

export default class SportsCourtRequestsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const reservationTime = request.input('reservationTime')

    const sportsCourtId = request.param('sportsCourtId') as number
    const userId = auth.user!.id

    const existing = await SportsCourtRequest.query()
      .where('sportsCourtId', sportsCourtId)
      .where('status', 'PENDING')
      .andWhere('userId', userId)
      .first()

    if (existing) throw new BadRequest('sports court request already exists', 409)
    console.log(reservationTime)
    const sportsCourtRequest = await SportsCourtRequest.create({
      userId,
      sportsCourtId,
      reservationTime,
    })

    await sportsCourtRequest.refresh()

    response.created({ sportsCourtRequest })
  }

  public async show({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('requestId') as number
    const sportsCourtRequest = await SportsCourtRequest.findOrFail(id)

    response.ok({ sportsCourtRequest })
  }

  public async index({ response }: HttpContextContract) {
    const sportsCourts = await SportsCourtRequest.query()
      .where('status', 'PENDING')
      .preload('user')
      .preload('sportsCourt')
    response.ok({ sportsCourts })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('requestId') as number
    const sportsCourtPayload = request.all()

    const sportsCourt = await SportsCourtRequest.findOrFail(id)

    const updatedSportsCourt = await sportsCourt.merge(sportsCourtPayload).save()

    response.ok({ sportsCourt: updatedSportsCourt })
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('requestId') as number
    const sportsCourt = await SportsCourtRequest.findOrFail(id)

    await sportsCourt.delete()

    response.ok({})
  }
}
