import { window, workspace } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
export async function createFolderImageInRoot(text: string) {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders) {
        window.showInformationMessage('Open a folder first to create image folder');
        return;
    }

    
    const rootFolder = workspaceFolders[0].uri.fsPath;
    const folderImagesName = text;
    const folderPublicName = "public";
    const folderPublicPath = path.join(rootFolder, folderPublicName);
    const folderImagePublicPath = path.join(folderPublicPath, folderImagesName);
    if (fs.existsSync(folderImagePublicPath)) {
        window.showInformationMessage('Folder already exists');
        return;
    }
    fs.mkdirSync(folderPublicPath);
    fs.mkdirSync(folderImagePublicPath);
    window.showInformationMessage('Folder created');
}