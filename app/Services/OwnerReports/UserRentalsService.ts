import Database from '@ioc:Adonis/Lucid/Database'

export default class UserRentalsService {
  public async getUserWithMostRentals(ownerId: number): Promise<any> {
    const mostFrequentUser = await Database.query()
      .from('reservations')
      .select('user_id')
      .count('user_id as rentalsCount')
      .where('status', 'COMPLETED')
      .where('owner_id', ownerId)
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
        .where('reservations.user_id', userId)
        .count('reservations.id as userRentalsCount')
        .sum('reservations.amount as totalAmountSpent') // Adiciona esta linha para calcular o valor total gasto
        .groupBy('users.name', 'users.phone_number')
        .first()

      return mostFrequentUserDetails
    }

    return null
  }
}
