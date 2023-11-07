import BadRequestException from 'App/Exceptions/BadRequestException'
import Reservation from 'App/Models/Reservation'
import SportsCenter from 'App/Models/SportsCenter'
import SportsCourt from 'App/Models/SportsCourt'
import User from 'App/Models/User'

import ReservationTimeService from './ReservationTimeService'

const timeService = new ReservationTimeService()

export default class CrudReservationsService {
  public async createReservation(
    sportsCourtId: number,
    sportsCenterId: number,
    user: User,
    reservationPayload
  ): Promise<{
    reservation: Reservation
    sportsCenterName: string
    sportsCourtName: string
  }> {
    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)
    const owner = await User.findOrFail(sportsCenter.ownerId)

    await timeService.validateDate(reservationPayload.startTime, reservationPayload.endTime)

    await timeService.duplicateTime(
      reservationPayload.startTime,
      reservationPayload.endTime,
      sportsCourtId
    )

    const reservation = await Reservation.create(reservationPayload)
    await reservation.related('owner').associate(owner)
    await reservation.related('sportsCourt').associate(sportsCourt)
    await reservation.related('user').associate(user)

    return {
      reservation: reservation,
      sportsCenterName: sportsCenter.name,
      sportsCourtName: sportsCourt.name,
    }
  }

  public async updateReservation(reservationId: number, reservationPayload): Promise<Reservation> {
    const reservation = await Reservation.findOrFail(reservationId)
    await timeService.validateDate(reservationPayload.startTime, reservationPayload.endTime)

    await timeService.duplicateTime(
      reservationPayload.startTime,
      reservationPayload.endTime,
      reservation.sportsCourtId
    )

    await reservation.merge(reservationPayload).save()

    return reservation
  }

  public async deleteReservation(ReservationId: number): Promise<Reservation | undefined> {
    const reservation = await Reservation.findOrFail(ReservationId)

    if (reservation.status === 'CONFIRMED') {
      await reservation.merge({ status: 'CANCELED' }).save()
      return reservation
    } else if (reservation.status === 'PENDING') {
      await reservation.delete()
    } else throw new BadRequestException('Cannot delete this Reservation', 409)
  }

  public async acceptReservation(ReservationId: number): Promise<Reservation> {
    const reservation = await Reservation.findOrFail(ReservationId)

    await reservation.merge({ status: 'CONFIRMED' }).save()

    return reservation
  }

  public async rejectReservation(ReservationId: number): Promise<Reservation> {
    const reservation = await Reservation.findOrFail(ReservationId)
    await reservation.merge({ status: 'REJECTED' }).save()

    return reservation
  }
}
