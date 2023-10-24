import User from 'App/Models/User'

export default class MakeOwnerService {
  public async makeOwner(id: number): Promise<User> {
    const user = await User.findOrFail(id)
    const updateUser = await user.merge({ type: 'OWNER' }).save()

    return updateUser
  }
}
