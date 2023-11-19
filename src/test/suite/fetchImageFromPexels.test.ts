import path from 'path';
import fs, { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as assert from 'assert';
import fetch from 'node-fetch';

const pipe = promisify(pipeline);

interface PexelsPhoto {
    src: {
        large: string;
    };
}

interface PexelsApiResponse {
    photos: PexelsPhoto[];
}

async function fetchImageFromPexels(query: string, apikey: string): Promise<string> {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.pexels.com/v1/search?query=${encodedQuery}&per_page=1&page=1`;

    const response = await fetch(url, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'Authorization': apikey }
    });
    

    if (!response.ok) {
        throw new Error(`Failed to fetch image from Pexels. Status code: ${response.status}`);
    }

    const data = (await response.json()) as PexelsApiResponse;
    if (!data.photos || data.photos.length === 0) {
        throw new Error('No photos found on Pexels.');
    }

    return data.photos[0].src.large;
}

async function downloadImage(url: string, folderPath: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {throw new Error(`Failed to download image. Status code: ${response.status}`);}

    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(folderPath, fileName);
    const fileStream = createWriteStream(filePath);

    if (response.body) {
        await pipe(response.body, fileStream);
    } else {
        throw new Error('Response body is null');
    }

    return filePath;
}

suite('Pexels API Test', function () {
    test('should fetch and download an image for query', async function () {

        const query = 'cat';
        const folderPath = './downloaded_images';
        const PEXELS_API_KEY = "PEXELS_API_KEY";

        const url = await fetchImageFromPexels(query, PEXELS_API_KEY);
        console.log('Fetched URL:', url);
        assert.ok(url.includes('http')); 
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const filePath = await downloadImage(url, folderPath);
        console.log('Downloaded Image Path:', filePath);
        assert.ok(fs.existsSync(filePath)); 
    });
});

