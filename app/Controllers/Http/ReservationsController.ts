import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import Reservation from 'App/Models/Reservation'
import SportsCenter from 'App/Models/SportsCenter'
import CrudReservationsService from 'App/Services/Reservations/CrudReservationsService'
import CreateReservationValidator from 'App/Validators/CreateReservationValidator'
import UpdateReservationValidator from 'App/Validators/UpdateReservationValidator'

const service = new CrudReservationsService()

export default class ReservationsController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response, bouncer }: HttpContextContract) {
    try {
      const ownerId = request.param('ownerId') as number

      await bouncer.authorize(
        'manageSportsCenter',
        await SportsCenter.findByOrFail('ownerId', ownerId)
      )

      const reservations = await Reservation.query()
        .preload('sportsCourt', (query) => {
          query.select('name')
        })
        .preload('user', (query) => {
          query.select('name', 'phone_number')
        })
        .where('owner_id', ownerId)

      response.ok({ reservation: reservations })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()

      const sportsCenterId = request.param('sportsCenterId') as number
      const sportsCourtId = request.param('sportsCourtId') as number

      await bouncer.authorize('createReservation')

      const reservationPayload = await request.validate(CreateReservationValidator)

      const { reservation, sportsCenterName, sportsCourtName } = await service.createReservation(
        sportsCourtId,
        sportsCenterId,
        user,
        reservationPayload
      )
      await await this.auditLog(
        'CREATE RESERVATION',
        `User ${user.name} create a reservation on the court ${sportsCourtName} at sports center: ${sportsCenterName}`,
        user.id
      )
      response.created({ reservation })
    } catch (error) {
      if (error.messages)
        response.status(error.status).send({ code: error.code, message: error.messages })
      else response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const reservationId = request.param('reservationId') as number

      await bouncer.authorize('manageReservation', await Reservation.findOrFail(reservationId))

      const reservationPayload = await request.validate(UpdateReservationValidator)

      const reservation = await service.updateReservation(reservationId, reservationPayload)

      await this.auditLog(
        'UPDATE RESERVATION',
        `User ${user.name} update a : ${reservation.id} `,
        user.id
      )
      response.ok({ reservation })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async delete({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const reservationId = request.param('reservationId') as number

      await bouncer.authorize('manageReservation', await Reservation.findOrFail(reservationId))

      await service.deleteReservation(reservationId)

      const user = await auth.authenticate()
      await this.auditLog(
        'DELETE RESERVATION',
        `User ${user.name} delete a reservation: ${reservationId} `,
        user.id
      )

      response.ok({})
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async accept({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const reservationId = request.param('reservationId') as number

      await bouncer.authorize(
        'acceptOrDenyReservation',
        await Reservation.findOrFail(reservationId)
      )

      const reservation = await service.acceptReservation(reservationId)

      const user = await auth.authenticate()
      await this.auditLog(
        'ACCEPT RESERVATION',
        `User ${user.name} accepted a reservation in reservation: ${reservation.id} `,
        user.id
      )

      response.ok({ reservation })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async reject({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const reservationId = request.param('reservationId') as number

      await bouncer.authorize(
        'acceptOrDenyReservation',
        await Reservation.findOrFail(reservationId)
      )

      const reservation = await service.rejectReservation(reservationId)

      const user = await auth.authenticate()
      await this.auditLog(
        'REJECT RESERVATION',
        `User ${user.name} rejected a reservation in reservation: ${reservation.id} `,
        user.id
      )

      response.ok({ reservation })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }
}
