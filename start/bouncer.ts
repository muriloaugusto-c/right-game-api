/**
 * Contract source: https://git.io/Jte3T
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import Reservation from 'App/Models/Reservation'
import SportsCenter from 'App/Models/SportsCenter'
import User from 'App/Models/User'

/*
|--------------------------------------------------------------------------
| Bouncer Actions
|--------------------------------------------------------------------------
|
| Actions allows you to separate your application business logic from the
| authorization logic. Feel free to make use of policies when you find
| yourself creating too many actions
|
| You can define an action using the `.define` method on the Bouncer object
| as shown in the following example
|
| ```
| 	Bouncer.define('deletePost', (user: User, post: Post) => {
|			return post.user_id === user.id
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "actions" const from this file
|****************************************************************
*/
export const { actions } = Bouncer.define('updateUser', (user: User, updatedUser: User) => {
  return user.id === updatedUser.id
})
  .define('deleteUser', (user: User, deletedUser: User) => {
    return user.id === deletedUser.id || user.type === 'ADMIN'
  })
  .define('getUsers', (user: User) => {
    return user.type === 'ADMIN'
  })
  .define('makeOnwer', (user: User) => {
    return user.type === 'ADMIN'
  })
  .define('createSportsCenter', (user: User) => {
    return user.type === 'OWNER'
  })
  .define('manageSportsCenter', (user: User, sportsCenter: SportsCenter) => {
    return user.type === 'OWNER' && user.id === sportsCenter.ownerId
  })
  .define('createReservation', (user: User) => {
    return user.type === 'USER'
  })
  .define('manageReservation', (user: User, reservation: Reservation) => {
    return user.id === reservation.userId || user.id === reservation.ownerId
  })
  .define('acceptOrDenyReservation', (user: User, reservation: Reservation) => {
    return user.type === 'OWNER' && user.id === reservation.ownerId
  })

/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({})
