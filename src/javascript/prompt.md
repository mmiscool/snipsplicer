# 📘 JavaScript Snippet Rules for SnipSplicer

**You must strictly and consistently follow the rules below** when generating JavaScript code for integration using the SnipSplicer system. These rules ensure that all code is compatible with AST-based parsing and surgical code insertion or replacement.

---

### 🔒 Enforcement Notice

> **You must follow all rules in this prompt with absolute precision.**
> Any deviation — such as missing syntax wrappers, extra class members, partial methods, or global code — **will result in a failed merge.**
> These rules are not suggestions. They are **hard requirements** and must be followed without exception.

---

## ✅ Rule 1: No Global Code Execution – **Strictly Forbidden**

* Code **must never** execute outside a function or class method.
* All logic must reside **entirely within** a named function or a class method.
* Inclusion of global declarations or top-level runtime logic **will cause the merge to fail**.

❌ Not allowed:

```javascript
const a = 5;
console.log(a);
```

✅ Allowed:

```javascript
export function someFunction() {
    const a = 5;
    console.log(a);
}
```

## ✅ Rule 2: Export Statements Are **Mandatory**

* All top-level **functions** and **classes** must be prefixed with the `export` keyword.
* There are **no exceptions** to this rule.
* Omitting the `export` keyword will prevent correct module integration.

✅ Example:

```javascript
export function processData(input) {
    return input.trim();
}

export class Parser { }
```

❌ Incorrect Snippet (missing export):

```javascript
function processData(input) {
    return input.trim();
}
```

## ✅ Rule 3: Class Method Insertions/Replacements Must Be Fully Wrapped and Complete

* When modifying or adding methods (including constructors) to an existing class:

  * The snippet **must include** the full class declaration: `export class existingClass { ... }`
  * The method or constructor **must be complete** and syntactically valid.
  * Do **not** include unrelated methods or class body content unless they are being modified.
  * If a constructor is being changed, include only the constructor. If not, it **must not** appear in the snippet.
  * Naked or partial method definitions **will cause the merge to fail.**

✅ Correct Snippet Format:

```javascript
export class existingClass {
    methodBeingAdded() {
        alert('hello world');
        return 'example';
    }
}
```

❌ Incorrect Snippet (method not wrapped in class):

```javascript
methodBeingAdded() {
    alert('hello world');
    return 'example';
}
```

❌ Incorrect Snippet (includes unrelated method):

```javascript
export class existingClass {
    methodBeingAdded() {
        alert('hello world');
        return 'example';
    }

    unrelatedMethod() {
        console.log('do not include this');
    }
}
```

## ✅ Rule 4: Never Include Tests or Usage Examples (Unless Explicitly Requested)

* **Do not** include test cases, mock data, or example usage in any snippet **unless explicitly instructed to do so**.
* By default, snippets must consist **only** of the target function, class, method, or constructor as specified.
* Example invocations such as `myFunction()` or console output like `console.log(...)` **outside the method/class scope** are strictly forbidden unless directly requested.
* This rule ensures that **no junk or non-functional code** is merged into production codebases.
* When tests or usage examples are requested, they must be clearly separated from production code.

❌ Incorrect Snippet (includes usage without being asked):

```javascript
export function myFunction() {
    return 42;
}

console.log(myFunction());
```

✅ Correct Snippet (default behavior):

```javascript
export function myFunction() {
    return 42;
}
```


## ✅ Rule 5: Event Listeners Must Use Class Methods – **No Anonymous Functions Allowed**

* All event listeners must be added **inside a dedicated class method** such as `initEventListeners()` — never in the constructor directly or inline in another method.
* Event listener callbacks must be **named methods declared within the same class**.
* You must use `this.methodName.bind(this)` or equivalent to maintain proper context.
* The use of anonymous functions (including arrow functions) inside event listeners is **strictly forbidden**.

✅ Correct Example:

```javascript
export class MyComponent {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('btn').addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        // handle click
    }
}
```

❌ Incorrect Examples:

```javascript
// Anonymous function - not allowed
document.getElementById('btn').addEventListener('click', function(event) {
    // ...
});

// Arrow function - not allowed
document.getElementById('btn').addEventListener('click', (event) => {
    // ...
});
```

*This rule ensures clean separation of concerns, improves testability, and guarantees method reusability across class instances.*

---