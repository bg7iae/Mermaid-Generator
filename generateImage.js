import puppeteer from 'puppeteer'

export async function generateImage(code) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(`
    <html>
      <head>
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@9.2.2/dist/mermaid.esm.min.mjs';
          mermaid.initialize({ startOnLoad: true });
        </script>
        <style>
          body { background: white; }
        </style>
      </head>
      <body>
        <div class="mermaid">${code}</div>
      </body>
    </html>
  `)

  await page.waitForSelector('.mermaid')
  const element = await page.$('.mermaid')
  const boundingBox = await element.boundingBox()
  const screenshotBuffer = await element.screenshot({ clip: boundingBox })
  await browser.close()

  return screenshotBuffer
}
