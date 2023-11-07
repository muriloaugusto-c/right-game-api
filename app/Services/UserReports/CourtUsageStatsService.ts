import Reservation from 'App/Models/Reservation'

type MonthlyTotal = { month: number; completedReservations: number }

export default class CourtUsageStatsService {
  public async getCourtUsageTotal(userId: number): Promise<number> {
    const reservations = await Reservation.query()
      .where('user_id', userId)
      .andWhere('status', 'COMPLETED')

    const count = reservations.length

    return count
  }

  public async getCourtUsageByMonth(userId: number): Promise<MonthlyTotal[]> {
    const acceptedReservations = await Reservation.query()
      .select('start_time')
      .where('user_id', userId)
      .andWhere('status', 'COMPLETED')

    const monthlyTotals: MonthlyTotal[] = []

    acceptedReservations.forEach((reservation: Reservation) => {
      const startTime = new Date(reservation.startTime.toString())
      const month = startTime.getMonth() + 1

      const existingTotal = monthlyTotals.find((total) => total.month === month)

      if (existingTotal) {
        existingTotal.completedReservations += 1
      } else {
        monthlyTotals.push({ month, completedReservations: 1 })
      }
    })

    return monthlyTotals
  }
}
