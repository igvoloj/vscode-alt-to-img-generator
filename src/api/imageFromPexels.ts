import path from 'path';
import fs, { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';;
import fetch from 'node-fetch';
import { createFolderImageInRoot } from '../utilities/createFolderImageInRoot';
import { workspace } from 'vscode';

export async function imageFromPexels(query: string, folderPath: string, PEXELS_API_KEY: string): Promise<string> {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout'));
        }, 10000); 
    });

    try {
        const url = await Promise.race([
            fetchImageFromPexelsApi(query, PEXELS_API_KEY),
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

const pipe = promisify(pipeline);

interface PexelsPhoto {
    src: {
        large: string;
    };
}

interface PexelsApiResponse {
    photos: PexelsPhoto[];
}

async function fetchImageFromPexelsApi(query: string, apikey: string): Promise<string> {
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

async function downloadImage(url: string, pathToSave: string): Promise<string> {
    const workspaceFolders = workspace.workspaceFolders;
    // @ts-ignore
    const rootFolder = workspaceFolders[0].uri.fsPath;
    const folderPath = path.join(rootFolder, pathToSave);

    const response = await fetch(url);
    if (!response.ok) {throw new Error(`Failed to download image. Status code: ${response.status}`);}

    // await createFolderImageInRoot(folderPath);
    // const fileName = path.basename(new URL(url).pathname);
    // const filePath = path.join(folderPath, fileName)
    const fileStream = createWriteStream(folderPath);

    if (response.body) {
        await pipe(response.body, fileStream);
    } else {
        throw new Error('Response body is null');
    }

    return folderPath;
}
