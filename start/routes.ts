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

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/users', 'UsersController.store')
Route.put('/users/:id', 'UsersController.update').middleware('auth')

Route.post('/sessions', 'SessionsController.store')
Route.delete('/sessions', 'SessionsController.destroy')

Route.get('/getAllQuadras', 'SportsCourtController.getAllQuadras')
Route.get('/sportsCourt', 'SportsCourtController.index')
Route.get('/sportsCourt/:sportsCourtId', 'SportsCourtController.show')
Route.post('/sportsCourt', 'SportsCourtController.store').middleware('auth')
Route.put('/sportsCourt/:sportsCourtId', 'SportsCourtController.update').middleware('auth')
Route.delete('/sportsCourt/:sportsCourtId', 'SportsCourtController.destroy').middleware('auth')

Route.get('/sportsCourtRequests/index', 'SportsCourtRequestsController.index').middleware('auth')

Route.post(
  '/sportsCourt/:sportsCourtId/requests',
  'SportsCourtRequestsController.store'
).middleware('auth')

Route.get(
  '/sportsCourt/:requestId/requests_status',
  'SportsCourtRequestsController.show'
).middleware('auth')

Route.delete('/sportsCourt/:requestId/delete', 'SportsCourtRequestsController.destroy').middleware(
  'auth'
)

Route.put('/sportsCourt/:requestId/update', 'SportsCourtRequestsController.update').middleware(
  'auth'
)
