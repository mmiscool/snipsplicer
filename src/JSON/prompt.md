# 📦 JSON Snippet Rules for SnipSplicer

This guide defines the **required rules** for authoring JSON snippets in the SnipSplicer merge system. These rules ensure deterministic merging, structural integrity, and predictable behavior.

---

## 🔒 Enforcement Notice

> ⚠️ These rules are **mandatory**.  
> Improperly formatted snippets will be **rejected** or result in a **failed merge**.

---

## ✅ Rule 1: Snippets May Be Flat or Nested

* Snippets can be either:
  - A **flat array of objects**, or
  - A **nested tree of objects** using `children` arrays.
* Internally, all input is **flattened** and normalized before merging.

✅ Flat:
```json
[
  { "id": "container", "type": "section" },
  { "id": "title", "text": "Welcome", "setParentNode": "container" }
]
````

✅ Nested:

```json
{
  "id": "container",
  "type": "section",
  "children": [
    { "id": "title", "text": "Welcome" }
  ]
}
```

> All nested children are automatically converted to flat objects with appropriate `setParentNode` relationships.

---

## ✅ Rule 2: Every Object Must Have a Unique `"id"`

* Every object must include a unique `id` field.
* IDs are used for merging, deduplication, and referencing.

✅ Valid:

```json
{ "id": "buttonSave", "label": "Save" }
```

❌ Invalid:

```json
{ "label": "Save" }
```

> If an `id` is missing, one will be auto-generated — but this is discouraged in authored snippets.

---

## ✅ Rule 3: Use `setParentNode` to Define Nesting (Flat Mode)

* In flat snippets, use `"setParentNode": "parentId"` to place an object inside another.

✅ Example:

```json
{ "id": "inputEmail", "type": "text", "setParentNode": "formLogin" }
```

---

## ✅ Rule 4: Use `moveBefore` / `moveAfter` for Reordering

* Objects can be repositioned relative to siblings:

  * `"moveBefore": "targetId"`
  * `"moveAfter": "targetId"`

✅ Example:

```json
{ "id": "username", "moveAfter": "email" }
```

---

## ✅ Rule 5: Delete Objects with `DELETE_THIS_NODE`

* To delete an entire object, set `"DELETE_THIS_NODE": true`.

✅ Example:

```json
{ "id": "legacyField", "DELETE_THIS_NODE": true }
```

> Positional and parent attributes are ignored if the object is marked for deletion.

---

## ✅ Rule 6: Remove Specific Fields with `DELETE_THIS_ATTRIBUTE`

* To remove a single property from an object, set its value to `"DELETE_THIS_ATTRIBUTE"`.

✅ Example:

```json
{ "id": "inputEmail", "placeholder": "DELETE_THIS_ATTRIBUTE" }
```

---

## ✅ Rule 7: Objects with Duplicate IDs Are Merged

* If multiple objects share the same `id`, they are merged into a single instance.
* Properties in later objects override or augment earlier ones.

✅ Example:

```json
[
  { "id": "profile", "title": "User Profile" },
  { "id": "profile", "description": "Edit your info" }
]
```

✅ Result:

```json
{
  "id": "profile",
  "title": "User Profile",
  "description": "Edit your info"
}
```

---

## 🔁 Output Structure

* The merged output is **always hierarchical**.
* Any parent-child relationships are expressed via a `"children"` array on each node.
* Only one object per `id` will appear in the final output.

---

## ⚠️ Hard Requirements Summary

✅ Snippets may be flat or nested
✅ All objects must have a unique `id`
✅ Use `children` or `setParentNode` to define hierarchy
✅ Use `moveBefore` / `moveAfter` to define order
✅ Use `DELETE_THIS_NODE` to remove an object
✅ Use `"key": "DELETE_THIS_ATTRIBUTE"` to remove a field
✅ Merging of duplicates is based on `id`, later overrides earlier

---

## 📋 Example Snippet

```json
{
  "id": "formLogin",
  "type": "form",
  "children": [
    { "id": "inputUsername", "type": "text" },
    { "id": "inputPassword", "type": "password", "moveAfter": "inputUsername" },
    { "id": "inputUsername", "placeholder": "Enter your username" }
  ]
}
```

✅ This builds a `formLogin` form with two fields, where `inputPassword` is reordered and `inputUsername` is updated.

---