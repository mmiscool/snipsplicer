import { htmlManipulator } from "./html/html";
import { javascriptManipulator } from "./javascript/javascript";
import { cssManipulator } from "./css/css";
import { JsonManipulator } from "./json/json";


import html_prompt from "bundle-text:./html/prompt.md";
import javascript_prompt from "bundle-text:./javascript/prompt.md";
import css_prompt from "bundle-text:./css/prompt.md";
import JSON_prompt from "bundle-text:./json/prompt.md";

import general_rules_prompt from "bundle-text:./general_rules_prompt.md";
import final_thoughts_prompt from "bundle-text:./final_thoughts_prompt.md";
/*
 * This module provides functionality to manipulate and merge code in different programming languages.
 * It includes classes for HTML, JavaScript, and CSS manipulation, as well as prompts for each language.
 * The mergeCode function allows merging new code into existing code based on the specified language.
 */
export const mergeToolsPromptStrings = {
    html: html_prompt,
    javascript: javascript_prompt,
    css: css_prompt,
    json: JSON_prompt,
    general_rules: general_rules_prompt,
    final_thoughts: final_thoughts_prompt,

    complete: general_rules_prompt + javascript_prompt + html_prompt + css_prompt + final_thoughts_prompt,
}

/**
 * Merges new code into the original code using the specified language manipulator.
 * @param {string} lang - The programming language of the code (e.g., 'html', 'javascript', 'css').
 * @param {string} originalCode - The original code to be merged into.
 * @param {string} newCode - The new code to be merged.
 * @returns {Promise<string>} - The merged code.
 * @throws {Error} - If the language is not supported.
 */
export async function mergeCode(lang, originalCode, newCode) {
    let manipulator;
    let language = await lang.toLowerCase();
    switch (language) {
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



/**
 * Merges new code into the original code using the specified language manipulator.
 * @param {string} lang - The programming language of the code (e.g., 'html', 'javascript', 'css', 'json').
 * @param {string} originalCode - The original code to be merged into.
 * @param {string} newCode - The new code to be merged.
 * @returns {Promise<string>} - The merged code as a string.
 * @throws {Error} - If the language is not supported or invalid input is provided.
 */
export async function mergeCode(lang, originalCode, newCode) {
    let manipulator;
    const language = lang.toLowerCase();

    switch (language) {
        case 'html':
            manipulator = new htmlManipulator();
            break;
        case 'javascript':
            manipulator = new javascriptManipulator();
            break;
        case 'css':
            manipulator = new cssManipulator();
            break;
        case 'json':  // ✅ JSON case added cleanly
            manipulator = new JsonManipulator();
            break;
        default:
            throw new Error(`Unsupported language: ${lang}`);
    }

    await manipulator.setCode(originalCode);
    const mergedCode = await manipulator.mergeCode(newCode);
    return mergedCode;
}





/**
 * @typedef {Object} MergeTools
 * @property {function(string, string, string): Promise<string>} mergeCode - Merges new code into the original code.
 * @property {Object} mergeToolsPromptStrings - Contains prompt strings for different programming languages.
 * @property {string} mergeToolsPromptStrings.html - Prompt string for HTML.
 * @property {string} mergeToolsPromptStrings.javascript - Prompt string for JavaScript.
 * @property {string} mergeToolsPromptStrings.css - Prompt string for CSS.
 * @property {string} mergeToolsPromptStrings.general_rules - General rules prompt string.
 * @property {string} mergeToolsPromptStrings.final_thoughts - Final thoughts prompt string.
 * @property {string} mergeToolsPromptStrings.complete - Complete prompt string for all languages.
 */
export {
    htmlManipulator,
    javascriptManipulator,
    cssManipulator
};