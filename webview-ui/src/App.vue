<script setup lang="ts">
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown, vsCodeOption, vsCodeTextField } from "@vscode/webview-ui-toolkit";
import { vscode } from "./utilities/vscode";
import { ref } from "vue";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register([vsCodeButton(), vsCodeTextField()]);

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


const inputRef = ref('')
function handleHowdyClick() {
  console.log('inputRef', inputRef)
  vscode.postMessage({
    command: "setDirectoryFolder",
    text: inputRef.value
  });
  vscode.setState({ text: inputRef.value })
}
</script>

<template>
  <main>
    <h1>Hello world!</h1>
    <!-- <input label="Text1" v-model="inputRef" /> -->
    <vscode-text-field label="Text2" :value="inputRef" @input="(event: any) => inputRef = event.target.value" />
    <vscode-button @click="handleHowdyClick">Howdy!</vscode-button>
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
