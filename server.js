import { Router } from 'itty-router'
import { generateImage } from './generateImage'

const router = Router()

router.post('/generate', async (request) => {
  try {
    const { code } = await request.json()
    const imagePath = await generateImage(code)
    return new Response(imagePath, {
      headers: { 'Content-Type': 'image/png' }
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response('Error generating image: ' + error.message, { status: 500 })
  }
})

router.all('*', () => new Response('Not Found.', { status: 404 }))

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request))
})
