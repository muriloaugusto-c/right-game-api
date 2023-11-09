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

    // Cria um objeto Map para rastrear os meses e suas contagens
    const monthlyMap = new Map<number, MonthlyTotal>()

    // Itera sobre as reservas aceitas
    acceptedReservations.forEach((reservation: Reservation) => {
      const startTime = new Date(reservation.startTime.toString())
      const month = startTime.getMonth() + 1

      // Se o mês já existe no Map, incrementa a contagem
      if (monthlyMap.has(month)) {
        const existingTotal = monthlyMap.get(month)
        if (existingTotal) {
          existingTotal.completedReservations += 1
        }
      } else {
        // Se o mês não existe, cria um novo objeto MonthlyTotal
        monthlyMap.set(month, { month, completedReservations: 1 })
      }
    })

    // Preenche os meses ausentes com contagem zero
    for (let i = 1; i <= 12; i++) {
      if (!monthlyMap.has(i)) {
        monthlyMap.set(i, { month: i, completedReservations: 0 })
      }
    }

    // Ordena os resultados por mês
    monthlyMap.forEach((value) => {
      monthlyTotals.push(value)
    })

    monthlyTotals.sort((a, b) => a.month - b.month)

    // Retorna somente os 12 meses
    return monthlyTotals.slice(0, 12)
  }
}
