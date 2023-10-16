/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// ROTAS USERS
Route.get('/users', 'UsersController.index')
Route.post('/users', 'UsersController.store')
Route.put('/users/:userId', 'UsersController.update').middleware('auth')
Route.put('/users/:userId/owner', 'UsersController.makeOwner').middleware('auth')
Route.delete('/users/:userId', 'UsersController.destroy').middleware('auth')

// ROTAS SPORTSCENTERS
Route.get('/sportsCenters', 'SportsCentersController.index')
Route.post('/sportsCenters', 'SportsCentersController.store').middleware('auth')
Route.put('/sportsCenters/:sportsCenterId', 'SportsCentersController.update').middleware('auth')
Route.delete('/sportsCenters/:sportsCenterId', 'SportsCentersController.destroy').middleware('auth')

// ROTAS PRODUCTS
Route.get('/sportsCenters/:sportsCenterId/inventory', 'ProductsController.index')
Route.post('/sportsCenters/:sportsCenterId/inventory', 'ProductsController.store').middleware(
  'auth'
)
Route.put(
  '/sportsCenters/:sportsCenterId/inventory/:productId',
  'ProductsController.update'
).middleware('auth')
Route.delete(
  '/sportsCenters/:sportsCenterId/inventory/:productId',
  'ProductsController.destroy'
).middleware('auth')

// ROTAS SPORTSCOURTS
Route.get('/sportsCenters/:sportsCenterId/sportsCourts', 'SportsCourtsController.index')
Route.post(
  '/sportsCenters/:sportsCenterId/sportsCourts',
  'SportsCourtsController.store'
).middleware('auth')
Route.put(
  '/sportsCenters/:sportsCenterId/sportsCourts/:sportsCourtId',
  'SportsCourtsController.update'
).middleware('auth')
Route.delete(
  '/sportsCenters/:sportsCenterId/sportsCourts/:sportsCourtId',
  'SportsCourtsController.destroy'
).middleware('auth')

//ROTAS REQUESTRESERVATION
Route.get('/requestReservations/:ownerId', 'RequestReservationsController.index').middleware('auth')
Route.post(
  '/sportsCenters/:sportsCenterId/sportsCourts/:sportsCourtId/requestReservations',
  'RequestReservationsController.store'
).middleware('auth')
Route.put(
  '/requestReservations/:requestReservationId',
  'RequestReservationsController.update'
).middleware('auth')
Route.delete(
  '/requestReservations/:requestReservationId',
  'RequestReservationsController.delete'
).middleware('auth')
Route.put(
  '/requestReservations/:requestReservationId/accept',
  'RequestReservationsController.accept'
).middleware('auth')
Route.put(
  '/requestReservations/:requestReservationId/reject',
  'RequestReservationsController.reject'
).middleware('auth')

//ROTAS RATING

Route.post(
  '/sportsCenters/:sportsCenterId/sportsCourts/:sportsCourtId/rating',
  'RatingsController.store'
)
//Route.put('')

//ROTAS SESSIONS
Route.post('/sessions', 'SessionsController.store')
Route.delete('/sessions', 'SessionsController.destroy')
