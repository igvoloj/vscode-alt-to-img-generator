import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import OpenAI from 'openai';

async function fetchImageFromOpenAI(prompt: string, OPENAI_API_KEY: string): Promise<string> {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const image = await openai.images.generate({ model: "dall-e-3", prompt: prompt });
    
    const firstImage = image.data[0];
    if (!firstImage.url) {
        throw new Error('Image URL is missing.');
    }
    return firstImage.url; // Return the URL
}

async function downloadImage(url: string, folderPath: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {throw new Error(`Failed to download image. Status code: ${response.status}`);}

    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(folderPath, fileName);
    const fileStream = fs.createWriteStream(filePath);
    
    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on("error", reject);
        fileStream.on("finish", resolve);
    });

    return filePath;
}

suite('OpenAI API Test', function () {
    test('fetch and download an image for query', async function () {
        this.timeout(100000); // Set timeout to 100000ms (100 seconds)

        const query = '';
        const folderPath = './downloaded_images';
        const OPENAI_API_KEY = 'OPENAI_API_KEY'; // Replace with your actual API key

        try {
            const url = await fetchImageFromOpenAI(query, OPENAI_API_KEY);
            console.log('Fetched URL:', url);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const filePath = await downloadImage(url, folderPath);
            console.log('Downloaded Image Path:', filePath);
            assert.ok(fs.existsSync(filePath));
        } catch (error) {
            console.error('An error occurred:', error);
            throw error; // Rethrow the error to make the test fail
        }
    });
});
