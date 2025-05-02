import { htmlManipulator } from "./html/html";
import { javascriptManipulator } from "./javascript/javascript";
import { cssManipulator } from "./css/css";


import html_prompt from "bundle-text:./html/prompt.md";
import javascript_prompt from "bundle-text:./javascript/prompt.md";
import css_prompt from "bundle-text:./css/prompt.md";
import general_rules_prompt from "bundle-text:./general_rules_prompt.md";


export const mergeToolsPromptStrings = {
    html: html_prompt,
    javascript: javascript_prompt,
    css: css_prompt,
    general_rules: general_rules_prompt,

    complete: general_rules_prompt + javascript_prompt + html_prompt + css_prompt,
}


export class mergeTools {
    async mergeCode(lang, originalCode, newCode) {
        let manipulator;
        switch (lang) {
            case 'html':
                manipulator = new htmlManipulator(originalCode);
                break;
            case 'javascript':
                manipulator = new javascriptManipulator(originalCode);
                break;
            case 'css':
                manipulator = new cssManipulator(originalCode);
                break;
            default:
                throw new Error(`Unsupported language: ${lang}`);
        }

        await manipulator.setCode(originalCode);
        const mergedCode = await manipulator.mergeCode(newCode);
        return mergedCode;
    }
}