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
Route.get('/users', 'UsersController.index').middleware('auth')
Route.post('/users', 'UsersController.store')
Route.post('/owners/', 'UsersController.store')
Route.post('/users/owner', 'UsersController.store')
Route.put('/users/:userId', 'UsersController.update').middleware('auth')
Route.delete('/users/:userId', 'UsersController.destroy').middleware('auth')

// ROTAS SPORTSCENTERS
Route.get('/sportsCenters', 'SportsCentersController.index')
Route.get('/sportsCenters/:ownerId', 'SportsCentersController.index')
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

//ROTAS RESERVATIONS
Route.get('/reservations/:ownerId', 'ReservationsController.index').middleware('auth')
Route.post(
  '/sportsCenters/:sportsCenterId/sportsCourts/:sportsCourtId/reservations',
  'ReservationsController.store'
).middleware('auth')
Route.put('/reservations/:reservationId', 'ReservationsController.update').middleware('auth')
Route.delete('/reservations/:reservationId', 'ReservationsController.delete').middleware('auth')
Route.put('/reservations/:reservationId/accept', 'ReservationsController.accept').middleware('auth')
Route.put('/reservations/:reservationId/reject', 'ReservationsController.reject').middleware('auth')

//ROTAS RATING

Route.post(
  '/sportsCenters/:sportsCenterId/sportsCourts/:sportsCourtId/rating',
  'RatingsController.store'
)
//Route.put('')

//ROTAS REPORTS

Route.get(
  '/users/reports/reservation-history',
  'UsersReportsController.reservationHistory'
).middleware('auth')
Route.get('/users/reports/courtUsageStats', 'UsersReportsController.courtUsageStats').middleware(
  'auth'
)
Route.get(
  '/users/reports/courtUsageStatsByMonth',
  'UsersReportsController.courtUsageStatsByMonth'
).middleware('auth')
Route.get('/users/reports/totalSpent', 'UsersReportsController.totalSpent').middleware('auth')
Route.get(
  '/users/reports/totalSpentByMonth',
  'UsersReportsController.totalSpentByMonth'
).middleware('auth')

//ROTAS SESSIONS
Route.post('/sessions', 'SessionsController.store')
Route.delete('/sessions', 'SessionsController.destroy')
