import * as vscode from "vscode";
import { checkAttribute } from "./checkAttribute";
import { getAttributeValue } from "./getAttributeValue";

export function checkSrc(textLine: string, currentCursorPosition: number, textToReplace: string) {
  if (textLine.length === 0) {
    vscode.window.showInformationMessage("No text in line");
  }

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
        srcLocation = new vscode.Position(editor.selection.active.line, textLine.length + 10);
    } else {
        srcLocation = new vscode.Position(editor.selection.active.line, textLine.length - 2);
    }
      editBuilder.insert(srcLocation, ` src="${textToReplace}"`);
    });
    return;
  }

  const regexAltInTextLine = /alt=".*"/g;
  const promptAlt = getAttributeValue(textLine.match(regexAltInTextLine));
  console.log({ promptAlt });

  checkAttribute(textLine, currentCursorPosition, textToReplace, srcPosition);

  return promptAlt;
}
