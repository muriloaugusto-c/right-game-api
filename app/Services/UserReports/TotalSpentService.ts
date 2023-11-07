import Reservation from 'App/Models/Reservation'

type MonthlyTotal = { month: number; totalSpent: number }

export default class TotalSpentService {
  public async calculateTotalSpent(userId: number): Promise<number> {
    const acceptedReservations = await Reservation.query()
      .where('user_id', userId)
      .andWhere('status', 'COMPLETED')

    const totalSpent = acceptedReservations.reduce<number>(
      (total: number, reservation: Reservation) => (total += parseFloat(reservation.amount)),
      0
    ) as number

    return totalSpent
  }

  public async calculateTotalSpentByMonth(userId: number): Promise<MonthlyTotal[]> {
    const acceptedReservations = await Reservation.query()
      .select('amount', 'start_time')
      .where('user_id', userId)
      .andWhere('status', 'COMPLETED')

    const monthlyTotals: MonthlyTotal[] = []

    acceptedReservations.forEach((reservation: Reservation) => {
      const startTime = new Date(reservation.startTime.toString())
      const month = startTime.getMonth() + 1

      const existingTotal = monthlyTotals.find((total) => total.month === month)

      if (existingTotal) {
        existingTotal.totalSpent += parseFloat(reservation.amount)
      } else {
        monthlyTotals.push({ month, totalSpent: parseFloat(reservation.amount) })
      }
    })

    return monthlyTotals
  }
}
