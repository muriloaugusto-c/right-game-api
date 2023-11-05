import Reservation from 'App/Models/Reservation'
import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'

import { DateTime } from 'luxon'

export default class UpdateStatusReservation extends BaseTask {
  public static get schedule() {
    return CronTimeV2.everyMinute()
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    const reservations = await Reservation.query().where('status', 'CONFIRMED')

    for (const reservation of reservations) {
      const currentTime = DateTime.local()
      const startTime = reservation.startTime
      const endTime = reservation.endTime

      if (currentTime >= startTime && currentTime < endTime) {
        reservation.status = 'IN PROGRESS'
        await reservation.save()
      } else if (currentTime >= endTime) {
        reservation.status = 'COMPLETED'
        await reservation.save()
      }
    }
  }
}
