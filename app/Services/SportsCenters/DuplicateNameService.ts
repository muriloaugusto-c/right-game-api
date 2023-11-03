import SportsCenter from 'App/Models/SportsCenter'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class DuplicateNameService {
  public async nameDuplicate(name: string): Promise<boolean> {
    const sportsCenter = await SportsCenter.findBy('name', name)
    if (sportsCenter) throw new BadRequestException('Name is already in use', 409)
    else return true
  }
}
