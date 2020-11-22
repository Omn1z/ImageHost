import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Image from 'App/Models/Image'

export default class ImageChecker {
  public async handle ({ response, params }: HttpContextContract, next: () => Promise<void>) {
    if (!params.url) { return response.redirect('/') }
    const image = await Image.findBy('url', params.url)
    if (!image) { return response.redirect('/') }
    await next()
  }
}
