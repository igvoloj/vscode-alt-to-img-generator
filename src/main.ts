import * as vscode from 'vscode';
import { checkAlt } from "./utilities/checkAlt";
import { checkSrc } from "./utilities/checkSrc";

let lineText = '';
let currentCursorPosition = 0;
export function setSrcInImage() {
    const src = "mockedSRC";
    checkSrc(lineText, currentCursorPosition, src);
}
export function setAltInImage() {
    const alt = "mockedAlt";
    checkAlt(lineText, currentCursorPosition, alt);
}
export function handleChangeText(event: vscode.TextDocumentChangeEvent) {
    const tagTrigger = "<img";
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('Open a file first to manipulate text selection');
        return;
    }
    const { selection } = editor;
    const text = editor.document.lineAt(selection.active.line).text;
    if (!text.includes(tagTrigger)) {
        return;
    }
    lineText = text;
    currentCursorPosition = selection.active.character;
}