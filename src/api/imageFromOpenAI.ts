import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

export async function imageFromOpenAI(query: string, folderPath: string, OPENAI_API_KEY: string): Promise<string> {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout'));
        }, 100000); 
    });

    try {
        const url = await Promise.race([
            fetchImageFromOpenAIapi(query, OPENAI_API_KEY),
            timeout
        ]);

        if (typeof url !== 'string') {
            throw new Error('URL is not a string');
        }

        console.log('Fetched URL:', url);
        const filePath = await downloadImage(url, folderPath);
        console.log('Downloaded Image Path:', filePath);
        return filePath;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

async function fetchImageFromOpenAIapi(prompt: string, OPENAI_API_KEY: string): Promise<string> {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const image = await openai.images.generate({ model: "dall-e-3", prompt: prompt });
    
    const firstImage = image.data[0];
    if (!firstImage.url) {
        throw new Error('Image URL is missing.');
    }
    return firstImage.url;
}

async function downloadImage(url: string, folderPath: string): Promise<string> {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

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
