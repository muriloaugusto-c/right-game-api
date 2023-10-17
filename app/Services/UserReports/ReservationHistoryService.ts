import RequestReservation from 'App/Models/RequestReservation'

export default class ReservationHistoryService {
  public async getReservationHistory(userId: number): Promise<RequestReservation[]> {
    return RequestReservation.query()
      .preload('sportsCourt')
      .where('user_id', userId)
      .orderBy('created_at', 'asc')
      .limit(10)
  }
}
