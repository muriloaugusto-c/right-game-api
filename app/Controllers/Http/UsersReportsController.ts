// app/Controllers/Http/UserReportsController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CourtUsageStatsService from 'App/Services/UserReports/CourtUsageStatsService'
import ReservationHistoryService from 'App/Services/UserReports/ReservationHistoryService'
import TotalSpentService from 'App/Services/UserReports/TotalSpentService'

export default class UserReportsController {
  public async reservationHistory({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new ReservationHistoryService()
    const reservationHistory = await service.getReservationHistory(user.id)

    return response.ok({ reservationHistory })
  }

  public async courtUsageStats({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new CourtUsageStatsService()
    const courtUsageStats = await service.getCourtUsageTotal(user.id)

    return response.ok({ courtUsageStats })
  }

  public async courtUsageStatsByMonth({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new CourtUsageStatsService()
    const courtUsageStats = await service.getCourtUsageByMonth(user.id)

    return response.ok({ courtUsageStats })
  }

  public async totalSpent({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new TotalSpentService()
    const totalSpent = await service.calculateTotalSpent(user.id)

    return response.ok({ totalSpent })
  }

  public async totalSpentByMonth({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new TotalSpentService()
    const totalSpentByMonth = await service.calculateTotalSpentByMonth(user.id)

    return response.ok({ totalSpentByMonth })
  }
}
