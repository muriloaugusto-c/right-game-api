import Database from '@ioc:Adonis/Lucid/Database'

export default class UserRentalsService {
  public async getUserWithMostRentals(ownerId: number): Promise<any> {
    const mostFrequentUser = await Database.query()
      .from('reservations')
      .select('user_id')
      .count('user_id as rentalsCount')
      .where('status', 'COMPLETED')
      .andWhere('owner_id', ownerId)
      .groupBy('user_id')
      .orderBy('rentalsCount', 'desc')
      .first()

    if (mostFrequentUser) {
      const userId = mostFrequentUser.user_id

      const mostFrequentUserDetails = await Database.query()
        .from('reservations')
        .join('users', 'reservations.user_id', 'users.id')
        .select('users.name', 'users.phone_number')
        .where('reservations.owner_id', ownerId)
        .andWhere('reservations.user_id', userId)
        .andWhere('reservations.status', 'COMPLETED') // Adicionando filtro por status
        .count('reservations.id as userRentalsCount')
        .sum('reservations.amount as totalAmountSpent')
        .groupBy('users.name', 'users.phone_number')
        .first()

      return mostFrequentUserDetails
    }

    return null
  }
}
