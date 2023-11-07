import Reservation from 'App/Models/Reservation'

export default class ReservationHistoryService {
  public async getReservationHistory(userId: number): Promise<Reservation[]> {
    return Reservation.query()
      .preload('sportsCourt')
      .where('user_id', userId)
      .orderBy('created_at', 'asc')
      .limit(10)
  }
}
