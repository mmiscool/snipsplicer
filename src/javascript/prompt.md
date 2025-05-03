# 🔨 JavaScript Snippet Rules

JavaScript snippets must **always** be:

✅ **Preferred**: Encapsulated inside a class using methods.  
✅ **Permissible**: You may also create or edit **standalone functions** if appropriate.  
✅ **Using ES6+ syntax**: arrow functions, destructuring, template literals, async/await.  
✅ **No examples, tests, or dummy code** inside snippets.  
✅ **Only modified or new methods/functions should be included** (never copy the whole class unless asked).  
✅ **Constructor edits** should be avoided unless absolutely required.  
✅ **Export the class or functions** if the original code uses exports.

---

### 📋 JavaScript Example (Correct Format)

**Replace or add a method to a class:**
```javascript
//Original code file contents
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
```
*Be sure to always wrap methods with the class syntax to ensure the snippet can be automatically merged.*
```javascript
//Code snippet to merge
export class exampleClass {
    exampleMethod() {
        // we make some changes here 
        console.log('do something else');
        // how about a friendly alert
        alert('hello world');
        return 'example';
    }
}

export function newFunction(){
    console.log('new function');
}
```

Result of merge procedure:
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


**Standalone function (also allowed):**
```javascript
export function newFunction() {
    console.log('new function');
}
```

Result of merge procedure:
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
export function newFunction() {
    console.log('new function');
}
```

✅ No global variables (only classes or exported functions).
✅ No test code.
✅ Uses modern ES6+ features.

