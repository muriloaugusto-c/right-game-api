import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CourtUsageService from 'App/Services/OwnerReports/CourtUsageService'
import TotalReceivedService from 'App/Services/OwnerReports/TotalReceivedService'
import UserRentalsService from 'App/Services/OwnerReports/UserRentalsService'

export default class OwnersReportsController {
  public async courtUsageTotal({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new CourtUsageService()

    const courtUsageTotal = await service.getCourtUsageTotal(user.id)
    response.ok({ courtUsageTotal })
  }

  public async courtUsageByMonth({ request, response, auth }: HttpContextContract) {
    const sportsCourtId = request.param('sportsCourtId') as number
    const user = await auth.authenticate()
    const service = new CourtUsageService()

    if (sportsCourtId) {
      const courtUsageByMonth = await service.getCourtUsageByMonthAndSportsCourtId(
        user.id,
        sportsCourtId
      )
      return response.ok({ courtUsageByMonth })
    } else {
      const courtUsageByMonth = await service.getCourtUsageByMonth(user.id)
      return response.ok({ courtUsageByMonth })
    }
  }

  public async userMostRental({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new UserRentalsService()

    const userMostRental = await service.getUserWithMostRentals(user.id)
    return response.ok({ userMostRental })
  }

  public async totalReceived({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new TotalReceivedService()

    const totalReceived = service.calculateTotalReceived(user.id)
    return response.ok({ totalReceived })
  }

  public async totalReceivedByMonth({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const service = new TotalReceivedService()

    const totalReceivedByMonth = service.calculateTotalReceivedByMonth(user.id)
    return response.ok({ totalReceivedByMonth })
  }
}
