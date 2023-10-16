/**
 * Contract source: https://git.io/Jte3T
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import RequestReservation from 'App/Models/RequestReservation'
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
    return user.id === deletedUser.id
  })
  .define('makeOnwer', (user: User) => {
    return user.type === 'ADMIN'
  })
  .define('createSportsCenter', (user: User) => {
    return user.type === 'OWNER'
  })
  .define('manageSportsCenter', (user: User, sportsCenter: SportsCenter) => {
    return user.type === 'OWNER' && user.id === sportsCenter.owner
  })
  .define('createReservationRequest', (user: User) => {
    return user.type === 'USER'
  })
  .define('manageReservationRequest', (user: User, requestReservation: RequestReservation) => {
    return user.id === requestReservation.userId || user.id === requestReservation.ownerId
  })
  .define(
    'acceptOrDenyReservationRequest',
    (user: User, requestReservation: RequestReservation) => {
      return user.type === 'OWNER' && user.id === requestReservation.ownerId
    }
  )

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
