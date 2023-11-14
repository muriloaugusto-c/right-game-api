import BadRequestException from 'App/Exceptions/BadRequestException'
import Reservation from 'App/Models/Reservation'
import { DateTime } from 'luxon'

export default class ReservationTimeService {
  public async duplicateTime(
    startTime: string,
    endTime: string,
    sportsCourtId: number
  ): Promise<Boolean> {
    const reservation = await Reservation.query()
      .where('sports_court_id', sportsCourtId)
      .whereIn('status', ['CONFIRMED', 'IN PROGRESS', 'COMPLETED'])
      .andWhere((query) => {
        query
          .where((subQuery) => {
            // Verifica se o horário de início da reserva está entre o horário de uma reserva existente
            subQuery.where('start_time', '>=', startTime).where('start_time', '<', endTime)
          })
          .orWhere((subQuery) => {
            // Verifica se o horário da fim da reserva está entre o horário de uma reserva existente
            subQuery.where('end_time', '>', startTime).where('end_time', '<=', endTime)
          })
          .orWhere((subQuery) => {
            // Verifica se o horário envolve completamente o horário de uma reserva existente
            subQuery.where('start_time', '<', startTime).where('end_time', '>', endTime)
          })
      })
      .first()

    if (reservation) throw new BadRequestException('Reservation Time is Already in use', 409)
    return true
  }

  public async validateDate(startTime: DateTime, endTime: DateTime): Promise<Boolean> {
    const currentTimeUtc = DateTime.local()
    const currentTime = currentTimeUtc.minus({ hours: 3 })

    if (startTime <= currentTime)
      throw new BadRequestException('Date/time cannot be in the past', 400)

    if (endTime <= startTime) {
      throw new BadRequestException('The endTime must be higher than the startTime', 400)
    }

    const differenceInMilliseconds = endTime.diff(startTime).milliseconds
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60)

    if (differenceInMinutes < 60) {
      throw new BadRequestException(
        'The difference between startTime and endTime must be at least 30 minutes',
        400
      )
    }

    return true
  }
}
