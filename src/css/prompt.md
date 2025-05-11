# 📚 CSS Snippet Rules for SnipSplicer

The following examples define how to formulate CSS snippets for automatic merging in to the existing CSS code. 

---

### ✅ Rule 1: **Selectors are merged if duplicated**

If both the original and the new snippet define the same selector, their declarations are combined into one rule.

#### 🔷 Input (Original):
```css
.button {
  color: red;
}
```

#### 🔷 Input (Snippet):
```css
.button {
  background: blue;
}
```

#### ✅ Result:
```css
.button {
  color: red;
  background: blue;
}
```

---

### ✅ Rule 2: **Later declarations override earlier ones**

When both the original and new code define the same property under the same selector, the new value overwrites the old one.

#### 🔷 Input (Original):
```css
.button {
  color: red;
}
```

#### 🔷 Input (Snippet):
```css
.button {
  color: green;
}
```

#### ✅ Result:
```css
.button {
  color: green;
}
```

---

### ✅ Rule 3: **Use `DELETE_THIS` as the value to remove a declaration**

To remove a specific property from an existing selector, set its value to `DELETE_THIS`.

#### 🔷 Input (Original):
```css
.box {
  width: 100%;
  color: red;
}
```

#### 🔷 Input (Snippet):
```css
.box {
  color: DELETE_THIS;
}
```

#### ✅ Result:
```css
.box {
  width: 100%;
}
```

---

### ✅ Rule 4: **Remove an entire rule block using `DELETE_THIS: DELETE_THIS`**

To delete a whole CSS rule, define the selector and use exactly one declaration: `DELETE_THIS: DELETE_THIS`.

#### 🔷 Input (Original):
```css
.fancyDiv {
  background: black;
  color: white;
}
```

#### 🔷 Input (Snippet):
```css
.fancyDiv {
  DELETE_THIS: DELETE_THIS;
}
```

#### ✅ Result:
```css
/* .fancyDiv block is removed entirely */
```

---

### ✅ Rule 5: **Merging works inside @media blocks**

Selectors inside the same `@media` context are merged using the same rules. Matching is scoped to the exact `@media` block.

#### 🔷 Input (Original):
```css
@media (max-width: 600px) {
  .responsive {
    display: block;
    color: black;
  }
}
```

#### 🔷 Input (Snippet):
```css
@media (max-width: 600px) {
  .responsive {
    color: DELETE_THIS;
    background: white;
  }
}
```

#### ✅ Result:
```css
@media (max-width: 600px) {
  .responsive {
    display: block;
    background: white;
  }
}
```

---

### ✅ Rule 6: **Duplicate rule blocks are automatically merged**

If the same selector appears multiple times, their declarations are merged and duplicates are removed.

#### 🔷 Input (Original):
```css
.card {
  padding: 10px;
}
.card {
  margin: 10px;
}
```

#### 🔷 Input (Snippet):
```css
.card {
  border: 1px solid #000;
}
```

#### ✅ Result:
```css
.card {
  padding: 10px;
  margin: 10px;
  border: 1px solid #000;
}
```

---

### ✅ Rule 7: **Multiple declarations with the same property are deduplicated**

Only the last valid declaration for each property is kept.

#### 🔷 Input (Original):
```css
.button {
  color: red;
}
.button {
  color: green;
}
```

#### 🔷 Input (Snippet):
```css
.button {
  color: blue;
}
```

#### ✅ Result:
```css
.button {
  color: blue;
}
```

---

### ✅ Rule 8: **Context-aware selector merging inside nested blocks**

Selectors in different contexts (`@media`, `@supports`, etc.) are not merged with global rules or rules from other contexts.

#### 🔷 Input (Original):
```css
.button {
  color: red;
}
@media (max-width: 600px) {
  .button {
    color: blue;
  }
}
```

#### 🔷 Input (Snippet):
```css
@media (max-width: 600px) {
  .button {
    background: yellow;
  }
}
```

#### ✅ Result:
```css
.button {
  color: red;
}
@media (max-width: 600px) {
  .button {
    color: blue;
    background: yellow;
  }
}
```


















