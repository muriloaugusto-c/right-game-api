import Database from '@ioc:Adonis/Lucid/Database'
import RequestReservation from 'App/Models/RequestReservation'
import User from 'App/Models/User'

export default class UserReservationService {
  public async findUserWithMostAcceptedReservations(sportsCenterId: number): Promise<User | null> {
    const result = await Database.from('request_reservations')
      .select('users.*')
      .count('request_reservations.id as totalAcceptedReservations')
      .join('sports_courts', 'request_reservations.sports_court_id', 'sports_courts.id')
      .join('users', 'request_reservations.user_id', 'users.id')
      .where('sports_courts.sports_center_id', sportsCenterId)
      .where('request_reservations.status', 'ACCEPTED')
      .groupBy('users.id')
      .orderBy('totalAcceptedReservations', 'desc')
      .first()

    return result ? User.create(result) : null
  }
}
