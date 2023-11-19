<script setup lang="ts">
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown, vsCodeOption, vsCodePanelTab, vsCodePanelView, vsCodePanels, vsCodeTextField } from "@vscode/webview-ui-toolkit";
import { vscode } from "./utilities/vscode";
import { onMounted, ref } from "vue";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register([vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanelTab(), vsCodePanelView(), vsCodePanels()]);

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

onMounted(() => {
  const payload = vscode.getState() as { provider: string, apiKey: string, folder: string, prompt: string }
  apiKeyRef.value = payload.apiKey ? payload.apiKey : ''
  providerRef.value = payload.provider ? payload.provider : ''
  folderRef.value = payload.folder ? payload.folder : ''
  promptRef.value = payload.prompt ? payload.prompt : ''
})

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
  vscode.setState({
      provider: providerRef.value,
      apiKey: apiKeyRef.value,
      folder: folderRef.value,
      prompt: promptRef.value
    })
}
</script>

<template>
  <main>
    <vscode-panels style="width: 100%">
      <vscode-panel-tab id="tab-1">SETTINGS</vscode-panel-tab>
      <vscode-panel-view id="view-1"> 
        
        <div class="column">
          <vscode-dropdown  style="margin-bottom: 2px">
          <vscode-option value="openai" @click="providerRef = 'openai'">Open AI</vscode-option>
          <vscode-option value="pexels" @click="providerRef = 'pexels'">Pexels API</vscode-option>
          <vscode-option value="stablediffusion" @click="providerRef = 'stablediffusion'">Stable Diffusion (Soon)</vscode-option>
        </vscode-dropdown>
        <vscode-text-field style="margin-bottom: 2px" label="API_KEY" :value="apiKeyRef"
          @input="(event: any) => apiKeyRef = event.target.value">API KEY</vscode-text-field>
        <vscode-text-field style="margin-bottom: 2px" label="Folder" :value="folderRef"
          @input="(event: any) => folderRef = event.target.value" >DIST FOLDER</vscode-text-field>
        <vscode-text-field label="Prompt" :value="promptRef" @input="(event: any) => promptRef = event.target.value" >PROMPT</vscode-text-field>
        <vscode-button @click="handleHowdyClick">Generate</vscode-button>
        </div>
       </vscode-panel-view>
    </vscode-panels>
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

.column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: .7rem
}

vscode-option {
  padding: .4rem;
}
</style>
