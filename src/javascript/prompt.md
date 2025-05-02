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

**Inside a class (preferred):**
```javascript
export class UserManager {
  async createUser(userData) {
    // implementation
  }

  deleteUser(userId) {
    // implementation
  }
}
```
*Be sure to always wrap methods with the class syntax to ensure the snippet can be automatically merged.*


**Standalone function (also allowed):**
```javascript
export async function createUser(userData) {
  // implementation
}
```

✅ No global variables (only classes or exported functions).
✅ No test code.
✅ Uses modern ES6+ features.

