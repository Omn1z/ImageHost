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
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('upload', 'ApiImagesController.upload')
  Route.post('remove_using_url', 'ApiImagesController.removeByUrl')
  Route.get('last_images', 'ApiImagesController.getLastImages')
}).prefix('api')

Route.group((): void => {
  Route.get('s/:url', 'ApiImagesController.getByUrl')
}).prefix('storage')

Route.any('/s/:url', 'NuxtsController.render').middleware('existImg')
Route.any('*', 'NuxtsController.render')
