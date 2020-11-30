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
