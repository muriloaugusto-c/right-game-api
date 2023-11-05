import BadRequestException from 'App/Exceptions/BadRequestException'
import SportsCourt from 'App/Models/SportsCourt'

export default class DuplicateNameService {
  public async nameDuplicate(name: string, sportsCenterId: number): Promise<boolean> {
    const sportsCourt = await SportsCourt.query()
      .where('sports_center_id', sportsCenterId)
      .andWhere('name', name)
    if (sportsCourt) throw new BadRequestException('Name is already in use', 409)
    else return true
  }
}
