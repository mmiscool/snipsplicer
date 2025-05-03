# 🔵 HTML Snippet Rules

HTML snippets must **always** be:

✅ **Minimal**, affecting only what is necessary for the desired change.  
✅ **Every modifiable element must have a unique `id`**.  
✅ Use **special merging attributes** when needed:
- `DELETE_THIS_NODE` → Deletes a node.
- `setParentNode="parentId"` → Places the tag under a specific parent node.
- `moveBefore="id"` / `moveAfter="id"` → Reorder elements relative to others.
- Set any attribute to `attributeToDelete="DELETE_THIS_ATTRIBUTE"` to remove it.  

✅ All tags require one of the following attributes unless the node is being deleted:
- `setParentNode="parentId"`
- `moveBefore="id"` 
- `moveAfter="id"`

✅ Always produce a flat list of html tags. Nesting of tags will be taken care of using the **special merging attributes**
✅ Assume merging into a complete HTML document (`<!DOCTYPE html>` already exists).

---

### 📋 HTML Example (Correct Format)

**Inserting a New Node**:
```html
<p id="newParagraph" setParentNode="body">This is a new paragraph.</p>
```
✅ Adds a new `<p>` if no element with `id="newParagraph"` exists.

---

**Modifying an Existing Node**:
```html
<p id="userName" class="highlighted">Jane Doe</p>
```
✅ Updates the existing `id="userName"` element adding or modifying the class attribute.

---

**Remove an attribute from an existing node**:
```html
<p id="userName" class="DELETE_THIS_ATTRIBUTE">Jane Doe</p>
```
✅ Updates the existing `id="userName"` element removing the class attribute.

---

**Deleting a Node**:
```html
<p id="userName" DELETE_THIS_NODE></p>
```
✅ Deletes the element with `id="userName"`.

---

**Move a Node to a different parent**:
```html
<p id="userName" setParentNode="newContainer"></p>
```
✅ Moves the element into the parent with `id="newContainer"`. Only use this option if the node dose not have any children that could be used with moveBefore or moveAfter.

---

**Moving a Node Before Another Node**:
```html
<p id="movedItem" moveBefore="targetItem">Moved before target</p>
```
✅ During merge, `#movedItem` will be moved **before** the element with `id="targetItem"`.

---

**Moving a Node After Another Node**:
```html
<p id="movedItem" moveAfter="targetItem">Moved after target</p>
```
✅ During merge, `#movedItem` will be moved **after** the element with `id="targetItem"`.

---

**Creating nested tags**:
```html
<div id="loginContainer"></div>
  <h1 id="loginTitle" setParentNode="loginContainer">Welcome Back!</h1>
  <form id="loginForm" setParentNode="loginContainer"></form>
    <label id="usernameLabel" for="username" setParentNode="loginForm">Username</label>
    <input id="username" type="text" required="" moveAfter="usernameLabel">
    <label id="passwordLabel" for="password" moveAfter="username">Password</label>
    <input id="password" type="password" required="" moveAfter="passwordLabel">
    <button id="loginButton" type="submit" moveAfter="password">Login</button>
```




