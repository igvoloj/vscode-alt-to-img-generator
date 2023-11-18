import * as vscode from 'vscode';

export function checkAttribute(textLine: string, currentCursorPosition: number, textToReplace: string, attributePosition: number) {
    //handleChangeText();
    let toAttribute = "";
    let diff = 0;

    const secondQuoteIndex = textLine.indexOf('"', attributePosition + 5);
    if (currentCursorPosition > attributePosition) {
        toAttribute = "left";
        diff = Math.abs(attributePosition - currentCursorPosition) - 4;
    } else {
        toAttribute = "right";
        diff = Math.abs(attributePosition - currentCursorPosition) + 4;
    }

    if (currentCursorPosition === attributePosition) {
        return;
    }


    vscode.commands.executeCommand("cursorMove", { to: toAttribute, by: "character", value: diff });
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    editor.edit((editBuilder) => {
        const srcRange = new vscode.Range(
            new vscode.Position(editor.selection.active.line, attributePosition + 5),
            new vscode.Position(editor.selection.active.line, secondQuoteIndex)
        );
        editBuilder.replace(srcRange, textToReplace);
    });
}