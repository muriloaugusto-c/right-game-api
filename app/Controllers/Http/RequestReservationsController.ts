import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import RequestReservation from 'App/Models/RequestReservation'
import CrudRequestReservationsService from 'App/Services/RequestReservations/CrudRequestReservationsService'
import CreateRequestReservationValidator from 'App/Validators/CreateRequestReservationValidator'
import UpdateRequestReservationValidator from 'App/Validators/UpdateRequestReservationValidator'

const service = new CrudRequestReservationsService()

export default class RequestReservationsController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    try {
      const ownerId = request.param('ownerId') as number

      const requestReservations = await RequestReservation.query()
        .preload('sportsCourt', (query) => {
          query.select('name')
        })
        .where('owner_id', ownerId)

      response.ok({ requestReservation: requestReservations })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      await bouncer.authorize('createReservationRequest')
      const user = await auth.authenticate()

      const sportsCenterId = request.param('sportsCenterId') as number
      const sportsCourtId = request.param('sportsCourtId') as number

      await bouncer.authorize('createReservationRequest')

      const requestReservationPayload = await request.validate(CreateRequestReservationValidator)

      const { requestReservation, sportsCenterName, sportsCourtName } =
        await service.createRequestReservation(
          sportsCourtId,
          sportsCenterId,
          user,
          requestReservationPayload
        )
      await await this.auditLog(
        'CREATE REQUEST_RESERVATION',
        `User ${user.name} create a reservation request on the court ${sportsCourtName} at sports center: ${sportsCenterName}`,
        user.id
      )
      response.created({ requestReservation })
    } catch (error) {
      if (error.messages)
        response.status(error.status).send({ code: error.code, message: error.messages })
      else response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const requestReservationId = request.param('requestReservationId') as number

      await bouncer.authorize(
        'manageReservationRequest',
        await RequestReservation.findOrFail(requestReservationId)
      )

      const requestReservationPayload = await request.validate(UpdateRequestReservationValidator)

      const requestReservation = await service.updateRequestReservation(
        requestReservationId,
        requestReservationPayload
      )

      await this.auditLog(
        'UPDATE REQUEST_RESERVATION',
        `User ${user.name} update a reservation request in reservation: ${requestReservation.id} `,
        user.id
      )
      response.ok({ requestReservation })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async delete({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const requestReservationId = request.param('requestReservationId') as number

      await bouncer.authorize(
        'manageReservationRequest',
        await RequestReservation.findOrFail(requestReservationId)
      )

      await service.deleteRequestReservation(requestReservationId)

      const user = await auth.authenticate()
      await this.auditLog(
        'DELETE REQUEST_RESERVATION',
        `User ${user.name} delete a reservation request in reservation: ${requestReservationId} `,
        user.id
      )

      response.ok({})
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async accept({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const requestReservationId = request.param('requestReservationId') as number

      await bouncer.authorize(
        'acceptOrDenyReservationRequest',
        await RequestReservation.findOrFail(requestReservationId)
      )

      const requestReservation = await service.acceptRequestReservation(requestReservationId)

      const user = await auth.authenticate()
      await this.auditLog(
        'ACCEPT REQUEST_RESERVATION',
        `User ${user.name} accepted a reservation request in reservation: ${requestReservation.id} `,
        user.id
      )

      response.ok({ requestReservation })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async reject({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const requestReservationId = request.param('requestReservationId') as number

      await bouncer.authorize(
        'acceptOrDenyReservationRequest',
        await RequestReservation.findOrFail(requestReservationId)
      )

      const requestReservation = await service.rejectRequestReservation(requestReservationId)

      const user = await auth.authenticate()
      await this.auditLog(
        'REJECT REQUEST_RESERVATION',
        `User ${user.name} rejected a reservation request in reservation: ${requestReservation.id} `,
        user.id
      )

      response.ok({ requestReservation })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }
}
