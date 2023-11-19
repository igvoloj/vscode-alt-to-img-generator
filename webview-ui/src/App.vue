<script setup lang="ts">
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown, vsCodeOption, vsCodeTextField } from "@vscode/webview-ui-toolkit";
import { vscode } from "./utilities/vscode";
import { ref } from "vue";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register([vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption()]);

// To register more toolkit components, simply import the component
// registration function and call it from within the register
// function, like so:
//
// provideVSCodeDesignSystem().register(
//   vsCodeButton(),
//   vsCodeCheckbox()
// );
//
// Finally, if you would like to register all of the toolkit
// components at once, there's a handy convenience function:
//
// provideVSCodeDesignSystem().register(allComponents);
const apiKeyRef = ref('')
const folderRef = ref('')
const promptRef = ref('')
const providerRef = ref('')


function handleHowdyClick() {
  vscode.postMessage({
    command: 'generateImage',
    payload: {
      provider: providerRef.value,
      apiKey: apiKeyRef.value,
      folder: folderRef.value,
      prompt: promptRef.value
    }
  })
  vscode.setState({ API_KEY: apiKeyRef.value })
}
</script>

<template>
  <main>
    <h1>Hello world!</h1>
    <!-- <input label="Text1" v-model="inputRef" /> -->
    <vscode-dropdown style="margin-bottom: 2px">
      <vscode-option value="openai" @click="providerRef = 'openai'">Open AI ("dall-e-3")</vscode-option>
      <vscode-option value="pexels" @click="providerRef = 'pexels'">Pexels API</vscode-option>
    </vscode-dropdown>
    <vscode-text-field style="margin-bottom: 2px" label="API_KEY" :value="apiKeyRef" @input="(event: any ) => apiKeyRef = event.target.value" >API KEY</vscode-text-field> 
    <vscode-text-field style="margin-bottom: 2px" label="Folder" :value="folderRef" @input="(event: any ) => folderRef = event.target.value" />
    <vscode-text-field label="Prompt" :value="promptRef" @input="(event: any ) => promptRef = event.target.value" />
    <vscode-button @click="handleHowdyClick">Generate</vscode-button>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}
</style>
