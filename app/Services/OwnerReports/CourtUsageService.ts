import Reservation from 'App/Models/Reservation'

type MonthTotal = { month: number; completedReservations: number }

export default class CourtUsageService {
  public async getCourtUsageTotal(owner_id: number): Promise<number> {
    const reservations = await Reservation.query()
      .where('owner_id', owner_id)
      .andWhere('status', 'COMPLETED')

    const count = reservations.length

    return count
  }

  public async getCourtUsageByMonth(ownerId: number): Promise<MonthTotal[]> {
    const completedReservations = await Reservation.query()
      .select('reservations.*')
      .where('owner_id', ownerId)
      .andWhere('status', 'COMPLETED')

    const monthTotals: MonthTotal[] = []

    completedReservations.forEach((reservation: Reservation) => {
      const startTime = new Date(reservation.startTime.toString())
      const month = startTime.getMonth()

      const existingTotal = monthTotals.find((total) => total.month === month)

      if (existingTotal) {
        existingTotal.completedReservations += 1
      } else {
        monthTotals.push({ month: month, completedReservations: 1 })
      }
    })

    // Adiciona os meses faltantes com zero reservas concluídas
    for (let i = 1; i <= 12; i++) {
      const existingTotal = monthTotals.find((total) => total.month === i)
      if (!existingTotal) {
        monthTotals.push({ month: i, completedReservations: 0 })
      }
    }

    // Ordena os resultados por mês
    monthTotals.sort((a, b) => a.month - b.month)

    return monthTotals
  }

  public async getCourtUsageByMonthAndSportsCourtId(
    ownerId: number,
    sportsCourtId: number
  ): Promise<MonthTotal[]> {
    const completedReservations = await Reservation.query()
      .select('reservations.*')
      .where('owner_id', ownerId)
      .andWhere('status', 'COMPLETED')
      .andWhere('sports_court_id', sportsCourtId)

    const monthTotals: MonthTotal[] = []

    completedReservations.forEach((reservation: Reservation) => {
      const startTime = new Date(reservation.startTime.toString())
      const month = startTime.getMonth()

      const existingTotal = monthTotals.find((total) => total.month === month)

      if (existingTotal) {
        existingTotal.completedReservations += 1
      } else {
        monthTotals.push({ month: month, completedReservations: 1 })
      }
    })

    // Adiciona os meses faltantes com zero reservas concluídas
    for (let i = 0; i < 12; i++) {
      const existingTotal = monthTotals.find((total) => total.month === i)
      if (!existingTotal) {
        monthTotals.push({ month: i, completedReservations: 0 })
      }
    }

    // Ordena os resultados por mês
    monthTotals.sort((a, b) => a.month - b.month)

    return monthTotals
  }
}
