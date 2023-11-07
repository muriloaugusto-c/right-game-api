import Reservation from 'App/Models/Reservation'

type MonthlyTotal = { month: number; totalReceived: number }

export default class TotalReceivedService {
  public async calculateTotalReceived(ownerId: number): Promise<number> {
    const acceptedReservations = await Reservation.query()
      .where('owner_id', ownerId)
      .andWhere('status', 'COMPLETED')
    console.log('OWNER ID ' + ownerId)

    const totalReceived = acceptedReservations.reduce<number>(
      (total: number, reservation: Reservation) => (total += parseFloat(reservation.amount)),
      0
    ) as number

    console.log(totalReceived + ' TOTAL RECEBIDO')
    return totalReceived
  }

  public async calculateTotalReceivedByMonth(ownerId: number): Promise<MonthlyTotal[]> {
    const acceptedReservations = await Reservation.query()
      .select('amount', 'start_time')
      .where('owner_id', ownerId)
      .andWhere('status', 'COMPLETED')

    console.log('OWNER ID ' + ownerId)

    const monthlyTotals: MonthlyTotal[] = []

    acceptedReservations.forEach((reservation: Reservation) => {
      const startTime = new Date(reservation.startTime.toString())
      const month = startTime.getMonth() + 1

      const existingTotal = monthlyTotals.find((total) => total.month === month)

      if (existingTotal) {
        existingTotal.totalReceived += parseFloat(reservation.amount)
      } else {
        monthlyTotals.push({ month, totalReceived: parseFloat(reservation.amount) })
      }
    })

    // Adiciona os meses faltantes com total gasto zero
    for (let i = 1; i <= 12; i++) {
      const existingTotal = monthlyTotals.find((total) => total.month === i)
      if (!existingTotal) {
        monthlyTotals.push({ month: i, totalReceived: 0 })
      }
    }

    // Ordena os resultados por mês
    monthlyTotals.sort((a, b) => a.month - b.month)

    console.log(monthlyTotals + ' TOTAL RECEBIDO')

    return monthlyTotals
  }
}