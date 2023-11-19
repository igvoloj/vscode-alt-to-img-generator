import { CancellationToken, window, commands, ExtensionContext, SnippetString, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, Disposable } from "vscode";
import { getNonce } from "./utilities/getNonce";
import { getUri } from "./utilities/getUri";
import * as vscode from 'vscode';
import { handleChangeText, setAltInImage, setSrcInImage } from "./main";
import { createFolderImageInRoot } from "./utilities/createFolderImageInRoot";
import { imageFromOpenAI } from './api/imageFromOpenAI';
import { fetchImageFromPexels } from "./api/imageFromPexels";

const cats = {
  'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

export function activate(context: ExtensionContext) {
  setCommands(context);
  setTriggers();


  const provider = new GenerateAltImgViewProvider(context.extensionUri);

  const panel = vscode.window.createWebviewPanel(
    'catCoding',
    'Cat Coding',
    vscode.ViewColumn.One,
    {}
  );

  let iteration = 0;
  const updateWebview = () => {
    const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat';
    panel.title = cat;
    panel.webview.html = getWebviewContent(cat);
  };

  // Set initial content
  updateWebview();

  // And schedule updates to the content every second
  setInterval(updateWebview, 1000);

  context.subscriptions.push(
    window.registerWebviewViewProvider(GenerateAltImgViewProvider.viewType, provider));
  context.subscriptions.push(panel);

}

function setCommands(context: vscode.ExtensionContext) {
  const extensionName = "alt-to-img-generator";
  const commands = {
    getImage: `${extensionName}.getImage`,
    getAlt: `${extensionName}.getAlt`,
    createImageFolder: `${extensionName}.createImageFolder`,
  };
  const disposables = [
    vscode.commands.registerCommand(commands.getImage, () => setSrcInImage()),
    vscode.commands.registerCommand(commands.getAlt, () => setAltInImage()),
    vscode.commands.registerCommand(commands.createImageFolder, () => createFolderImageInRoot('images')),
  ];

  disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

function setTriggers() {
  vscode.workspace.onDidChangeTextDocument((event) => handleChangeText(event));
}

class GenerateAltImgViewProvider implements WebviewViewProvider {

  public static readonly viewType = 'alt-to-img-generator-view';

  constructor(
    private readonly _extensionUri: Uri,
    private readonly _disposables: Disposable[] = []

  ) { }

  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken,
  ) {
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri
      ]
    };

		webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);
    this._setWebviewMessageListener(webviewView.webview);

  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the Vue webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // The CSS file from the Vue build output
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    // The JS file from the Vue build output
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Hello World</title>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }


  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        const text = message.text ? message.text : null;
        const payload = message.payload ? message.payload : null;

        switch (command) {
          case "hello":
            // Code that should run in response to the hello message command
            window.showInformationMessage(text);
            return;
          case "setDirectoryFolder":
            createFolderImageInRoot(text);
            return;
          case "generateImage":
            switch (payload.provider) {
              case 'openai': {
                console.log('generateImgCommandReceived', payload);
                const result = await imageFromOpenAI(payload.prompt, payload.folder, payload.apiKey);
                window.showInformationMessage(result);
              }
              case 'pexels': {
                 console.log('generateImgCommandReceived', payload);
            const result = await fetchImageFromPexels(payload.prompt, payload.folder, payload.apiKey);
            window.showInformationMessage(result);
              }
            }
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside media/main.js)
        }
      },
      undefined,
      this._disposables
    );
  }


}

function getWebviewContent(cat: keyof typeof cats) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="${cats['Coding Cat']}" width="300" />
    <img src="${cats[cat]}" width="300" />
</body>
</html>`;
}
