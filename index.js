import { extension_prompt_types, setExtensionPrompt } from "../../../../script.js";

const INPUT_SCRIPT_INSTRUCTIONS = `<instructions>
**INPUTS**: Always use the \`<button>\` tag for buttons. Keep related inputs in the same div. Use \`<label>\` for text that's related to the input. Always use the \`for\` attribute on labels to specify which input the label is for. Example:
\`\`\`
<input type="radio" name="l" id="radio1">
<label for="radio1">Lorem ipsum</label>
\`\`\`
If there is supposed to be a button to apply changes, add the \`data-submit\` class to it. Example:
\`\`\`
<input type="checkbox">Some setting</input>
<button class="data-submit">Press me to submit changes.</button>
\`\`\`
</instructions>`;

const ELEMENT_CLICKABLE_ATTRIBUTE = "data-made-clickable";

function setImpersonateTextAndClickSend(inputElement, buttonText) {
    const textToSet = "/impersonate Describe {{USER}} doing the following: " + buttonText;
    inputElement.value = textToSet;
    
    // attempt to find send button by ID and click it 2 send mssg :v
    const sendButton = document.querySelector("#send_but");
    if (sendButton) {
        sendButton.click();
    }
}

function makeClickable(obj) {
    obj.addEventListener("click", (event) => {
        const targetElement = event.target;
        const buttonText = targetElement.innerText;
        const inputField = document.getElementById('send_textarea');
        if (inputField) {
            setImpersonateTextAndClickSend(inputField, buttonText);
        }
        event.preventDefault();
    });

    obj.setAttribute(ELEMENT_CLICKABLE_ATTRIBUTE, "true");
}

function processMessageDiv(i, obj) {
    jQuery(obj).find('button').each((i, obj) => {
        if (!obj.getAttribute(ELEMENT_CLICKABLE_ATTRIBUTE)) makeClickable(obj);
    });
}

function processMessageTextBlock(i, obj) {
    jQuery(obj).find('div').each(processMessageDiv);
}

function updateInputs() {
    jQuery(".mes_text").each(processMessageTextBlock);
    setExtensionPrompt("CLICKABLE_GENEREATED_INPUTS", INPUT_SCRIPT_INSTRUCTIONS, extension_prompt_types.IN_CHAT, 0);
}

jQuery(() => {
    setInterval(updateInputs, 1000);
    updateInputs();
});
