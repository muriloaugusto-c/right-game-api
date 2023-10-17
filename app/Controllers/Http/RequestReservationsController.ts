import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import RequestReservation from 'App/Models/RequestReservation'
import SportsCenter from 'App/Models/SportsCenter'
import SportsCourt from 'App/Models/SportsCourt'
import User from 'App/Models/User'
import CreateRequestReservationValidator from 'App/Validators/CreateRequestReservationValidator'
import UpdateRequestReservationValidator from 'App/Validators/UpdateRequestReservationValidator'

export default class RequestReservationsController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    const ownerId = request.param('ownerId') as number

    const requestReservations = await RequestReservation.query()
      .preload('sportsCourt', (query) => {
        query.select('name')
      })
      .where('owner_id', ownerId)

    response.ok({ requestReservation: requestReservations })
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const sportsCourtId = request.param('sportsCourtId') as number
    const requestReservationPayload = await request.validate(CreateRequestReservationValidator)

    const user = await auth.authenticate()
    await bouncer.authorize('createReservationRequest')

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)
    const owner = await User.findOrFail(sportsCenter.owner)

    const requestReservation = await RequestReservation.create(requestReservationPayload)
    await requestReservation.related('owner').associate(owner)
    await requestReservation.related('sportsCourt').associate(sportsCourt)
    await requestReservation.related('user').associate(user)

    await this.auditLog(
      'CREATE REQUEST_RESERVATION',
      `User ${user.name} create a reservation request on the court ${sportsCourt.name} at sports center: ${sportsCenter.name}`,
      user.id
    )
    response.created({ requestReservation })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const requestReservationId = request.param('requestReservationId') as number
    const requestReservationPayload = await request.validate(UpdateRequestReservationValidator)

    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    await bouncer.authorize('manageReservationRequest', requestReservation)

    const user = await auth.authenticate()
    await this.auditLog(
      'UPDATE REQUEST_RESERVATION',
      `User ${user.name} update a reservation request in reservation: ${requestReservation.id} `,
      user.id
    )

    const updateRequestReservation = await requestReservation.merge(requestReservationPayload)
    response.ok({ requestReservation: updateRequestReservation })
  }

  public async delete({ request, response, bouncer, auth }: HttpContextContract) {
    const requestReservationId = request.param('requestReservationId') as number

    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    await bouncer.authorize('manageReservationRequest', requestReservation)

    const user = await auth.authenticate()
    await this.auditLog(
      'DELETE REQUEST_RESERVATION',
      `User ${user.name} delete a reservation request in reservation: ${requestReservation.id} `,
      user.id
    )

    await requestReservation.delete()
    response.ok({})
  }

  public async accept({ request, response, bouncer, auth }: HttpContextContract) {
    const requestReservationId = request.param('requestReservationId') as number

    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    await bouncer.authorize('acceptOrDenyReservationRequest', requestReservation)

    await requestReservation.merge({ status: 'ACCEPTED' }).save()
    const reservation = await requestReservation.related('reservation').create({})

    const user = await auth.authenticate()
    await this.auditLog(
      'ACCEPT REQUEST_RESERVATION',
      `User ${user.name} accepted a reservation request in reservation: ${requestReservation.id} `,
      user.id
    )

    response.ok({ requestReservation, reservation })
  }

  public async reject({ request, response, bouncer, auth }: HttpContextContract) {
    const requestReservationId = request.param('requestReservationId') as number

    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    await bouncer.authorize('acceptOrDenyReservationRequest', requestReservation)

    await requestReservation.merge({ status: 'REJECTED' }).save()

    const user = await auth.authenticate()
    await this.auditLog(
      'REJECT REQUEST_RESERVATION',
      `User ${user.name} rejected a reservation request in reservation: ${requestReservation.id} `,
      user.id
    )

    response.ok({ requestReservation })
  }
}
