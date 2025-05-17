# SnipSplicer
SnipSplicer is a library for manipulating code files in various languages allowing for surgical file edits using snippets supplied by LLMs.
This tool uses AST (abstract syntax trees) to automatically merge LLM generate code snippets in to existing code. Because the process we use to merge LLM generate snippets is deterministic it is extremely relegable.

# Supported languages
- [javascript](./src/javascript/prompt.md)
- [html](./src/html/prompt.md)
- [css](./src/css/prompt.md)

# Problems with current code generation methods:
- Whole code file is regenerated each time a change is made
- LLMs some times like to forget things and delete large chunks of your original file when regenerating the whole file each time.
- LLM output is not guaranteed to be syntactically correct. 

# How we solve these problems
- By merging snippets that follow specific rules we can surgically modify the original code with out regenerating the whole file.
- Code is never accidentally deleted as any function or method not included in the snippet is touched. 
- Using ASTs to merge snippets with original code makes it impossible to merge syntactically incorrect code preventing corruption.  

# Snippet formatting rules that you can give your favorite LLM to guarantee they can be deterministically merged.  
- [javascript merge rules](./src/javascript/prompt.md)
- [html merge rules](./src/html/prompt.md)
- [css merge rules](./src/css/prompt.md)




# Usage
```javascript
import { mergeCode } from "snipsplicer";

let codeFileContents =`
    export class exampleClass {
        exampleMethod() {
            return 'example';
        }
        exampleMethod2() {
            return 'example2';
        }
        exampleMethod3() {
            return 'example3';
        }
    }
    `;

let snippetToMerge = `
    export class exampleClass {
        exampleMethod() {
            // we make some changes here 
            console.log('do something else');
            // how about a friendly alert
            alert('hello world');
            return 'example';
        }
    }
    `;

const resultingCodeAfterMerge = mergeCode("javascript", codeFileContents, snippetToMerge);

```

# result
```javascript
export class exampleClass {
    exampleMethod() {
        // we make some changes here 
        console.log('do something else');
        // how about a friendly alert
        alert('hello world');
        return 'example';
    }
    exampleMethod2() {
        return 'example2';
    }
    exampleMethod3() {
        return 'example3';
    }
}

```



# LLM prompts that include snippet generation rules can also be access from the library
```javascript
import { mergeToolsPromptStrings } from 'snipsplicer';
console.log(mergeToolsPromptStrings.complete); // complete prompt with snippet generation rules for all supported languages. 

console.log(mergeToolsPromptStrings.html); // html snippet formatting rules
console.log(mergeToolsPromptStrings.javascript); // javascript snippet formatting rules
console.log(mergeToolsPromptStrings.css); // css snippet formatting rules

```

