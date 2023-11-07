import Drive from '@ioc:Adonis/Core/Drive'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class ImagesService {
  public async uploadImage(image): Promise<string> {
    if (image) {
      await image.moveToDisk('right-game', { visibility: 'public', contentType: 'image/png' }, 's3')

      const uploadedFileName = image.fileName

      const imageUrl = await Drive.use('s3').getUrl(`${uploadedFileName}`)

      return imageUrl
    } else throw new BadRequestException('Image required', 400)
  }
}
