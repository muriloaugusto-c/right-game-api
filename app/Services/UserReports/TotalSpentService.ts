import RequestReservation from 'App/Models/RequestReservation'

export default class TotalSpentService {
  public async calculateTotalSpent(userId: number): Promise<number> {
    const acceptedReservations = await RequestReservation.query()
      .where('user_id', userId)
      .andWhere('status', 'PENDING')

    const totalSpent = acceptedReservations.reduce<number>(
      (total: number, reservation: RequestReservation) => (total += parseFloat(reservation.amount)),
      0
    ) as number

    return totalSpent
  }
}
