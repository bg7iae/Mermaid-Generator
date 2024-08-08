const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
    const { code } = req.body;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
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
        `);

        await page.waitForSelector('.mermaid');
        const element = await page.$('.mermaid');
        const boundingBox = await element.boundingBox();
        const screenshotPath = path.join(__dirname, 'public', 'output.png');

        await element.screenshot({ path: screenshotPath, clip: boundingBox });
        await browser.close();

        res.sendFile(screenshotPath);
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Error generating image: ' + error.message });
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
