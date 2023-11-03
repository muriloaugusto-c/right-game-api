import RequestReservation from 'App/Models/RequestReservation'
import SportsCenter from 'App/Models/SportsCenter'
import SportsCourt from 'App/Models/SportsCourt'
import User from 'App/Models/User'

export default class CrudRequestReservationsService {
  public async createRequestReservation(
    sportsCourtId: number,
    sportsCenterId: number,
    user: User,
    requestReservationPayload
  ): Promise<{
    requestReservation: RequestReservation
    sportsCenterName: string
    sportsCourtName: string
  }> {
    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)
    const owner = await User.findOrFail(sportsCenter.owner)

    const requestReservation = await RequestReservation.create(requestReservationPayload)
    await requestReservation.related('owner').associate(owner)
    await requestReservation.related('sportsCourt').associate(sportsCourt)
    await requestReservation.related('user').associate(user)

    return {
      requestReservation,
      sportsCenterName: sportsCenter.name,
      sportsCourtName: sportsCourt.name,
    }
  }

  public async updateRequestReservation(
    requestReservationId: number,
    requestReservationPayload
  ): Promise<RequestReservation> {
    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    const updatedRequestReservation = await requestReservation.merge(requestReservationPayload)

    return updatedRequestReservation
  }

  public async deleteRequestReservation(requestReservationId: number) {
    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    await requestReservation.delete()
  }

  public async acceptRequestReservation(requestReservationId: number): Promise<RequestReservation> {
    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    const updatedRequestReservation = await requestReservation.merge({ status: 'ACCEPTED' })

    await requestReservation.related('reservation').create({})

    return updatedRequestReservation
  }

  public async rejectRequestReservation(requestReservationId: number): Promise<RequestReservation> {
    const requestReservation = await RequestReservation.findOrFail(requestReservationId)
    const updatedRequestReservation = await requestReservation.merge({ status: 'REJECTED' })

    return updatedRequestReservation
  }
}
