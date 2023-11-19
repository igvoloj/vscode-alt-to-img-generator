import { window, workspace } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
export async function createFolderImageInRoot(pathToSave: string = "public/images") {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders) {
        window.showInformationMessage('Open a folder first to create image folder');
        return;
    }
    const rootFolder = workspaceFolders[0].uri.fsPath;

    const folderPath = path.join(rootFolder, pathToSave);
    if (fs.existsSync(folderPath)) {
        window.showInformationMessage('Folder already exists');
        return;
    }
    fs.mkdirSync(folderPath);
    window.showInformationMessage('Folder created');
}