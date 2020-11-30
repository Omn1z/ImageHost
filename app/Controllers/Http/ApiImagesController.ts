import path from 'path'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Image from 'App/Models/Image'
import md5 from 'md5'
import Jimp from 'jimp'

export default class ApiImagesController {
  public async addWatermark (filePath: string): Promise<void> {
    const [image, logo] = await Promise.all([
      Jimp.read(Application.tmpPath(`uploads/${filePath}`)),
      Jimp.read(path.resolve(__dirname, '../../../', 'resources/static/watermark.png'))
    ])

    const LOGO_MARGIN_PERCENTAGE = 5

    logo.resize(image.bitmap.width / 10, Jimp.AUTO)

    const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100
    const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100

    const X = image.bitmap.width - logo.bitmap.width - xMargin
    const Y = image.bitmap.height - logo.bitmap.height - yMargin

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    image.composite(logo, X, Y, [{
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.1,
      opacityDest: 1
    }])

    image.write(Application.tmpPath(`uploads/${filePath}`))
  }

  public async upload ({ request }: HttpContextContract) {
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    })

    if (!image) {
      return {
        status: 400,
        msg: 'Файл не обнаружен'
      }
    }

    if (image.hasErrors) {
      return {
        status: 400,
        msg: image.errors
      }
    }

    const oldImageName = image.clientName
    const newImageName = `${md5(`${new Date().getTime()}.${image.clientName}`)}.${image.extname}`

    await image.move(Application.tmpPath('uploads'), {
      name: newImageName
    })

    const imageInfo = new Image()

    imageInfo.path = newImageName
    imageInfo.url = md5(newImageName).substring(0, 7)

    await this.addWatermark(newImageName)

    try {
      await imageInfo.save()
    } catch (e) {
      return {
        status: 400,
        msg: 'Попробуйте еще раз'
      }
    }

    return {
      status: 201,
      msg: `Файл ${oldImageName} сохранен`,
      url: imageInfo.url
    }
  }

  public async getByUrl ({ response, params }: HttpContextContract) {
    const image = await Image.findBy('url', params.url)

    if (!image) {
      response.status(404)
      return
    }

    return response.download(Application.tmpPath(`uploads/${image.path}`))
  }

  public async getLastImages () {
    const images = await Image.all()

    const sorted = images.splice(0, 6)

    return JSON.stringify(Array.from(sorted, (image) => {
      return {
        url: image.url
      }
    }))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async removeByUrl ({ request }: HttpContextContract) {
    const url = request.all().url

    if (!url) {
      return {
        status: 400,
        msg: 'Файл не обнаружен'
      }
    }

    const image = await Image.findBy('url', url)

    if (!image) {
      return {
        status: 400,
        msg: 'Файл не обнаружен'
      }
    }

    await image.delete()

    return {
      status: 200,
      msg: 'Файл удален'
    }
  }
}
