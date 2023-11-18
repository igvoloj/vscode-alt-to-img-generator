import * as vscode from 'vscode';
import { checkAttribute } from './checkAttribute';

export function checkSrc(textLine: string, currentCursorPosition: number, textToReplace: string) {
    let srcPosition = textLine.indexOf("src");
    if (srcPosition === -1) {
        // create src attribute
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        editor.edit((editBuilder) => {
            const containsEndTag = textLine.includes("/>");
            let srcLocation: vscode.Position;
            if (!containsEndTag) {
                srcLocation = new vscode.Position(editor.selection.active.line, textLine.length);
            }
            srcLocation = new vscode.Position(editor.selection.active.line, textLine.length - 2);
            editBuilder.insert(srcLocation, ` src="${textToReplace}"`);
        });
        return;
    }
    checkAttribute(textLine, currentCursorPosition, textToReplace, srcPosition);
}