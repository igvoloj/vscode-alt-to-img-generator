import * as vscode from 'vscode';
import { checkAttribute } from './checkAttribute';
import { getAttributeValue } from './getAttributeValue';

export function checkAlt(textLine: string, currentCursorPosition: number, textToReplace: string) {
    if (textLine.length === 0) {
        vscode.window.showInformationMessage('No text in line');
    }
    const altPosition = textLine.indexOf("alt");

    if (altPosition === -1) {
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
            editBuilder.insert(srcLocation, ` alt="${textToReplace}"`);
        });
        return;
    }
    const regexSrcInTextLine = /src=".*"/g;
    const promptSrc = getAttributeValue(textLine.match(regexSrcInTextLine));

    checkAttribute(textLine, currentCursorPosition, textToReplace, altPosition);
}