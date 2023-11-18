import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
export async function createFolderImageInRoot() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showInformationMessage('Open a folder first to create image folder');
        return;
    }
    const rootFolder = workspaceFolders[0].uri.fsPath;
    const folderImagesName = "images";
    const folderPublicName = "public";
    const folderPublicPath = path.join(rootFolder, folderPublicName);
    const folderImagePublicPath = path.join(folderPublicPath, folderImagesName);
    if (fs.existsSync(folderImagePublicPath)) {
        vscode.window.showInformationMessage('Folder already exists');
        return;
    }
    fs.mkdirSync(folderPublicPath);
    fs.mkdirSync(folderImagePublicPath);
    vscode.window.showInformationMessage('Folder created');
}