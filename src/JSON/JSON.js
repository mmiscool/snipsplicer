export class JsonManipulator {
    constructor() {
        this.flatList = [];
        this.idMap = new Map();
    }

    async setCode(code) {
        const parsedOriginal = typeof code === 'string' ? JSON.parse(code) : code;
        const flattened = [];

        const flatten = (node, parentId = null) => {
            if (!node.id) node.id = this._generateUniqueId();

            const { children = [], ...rest } = node;
            if (parentId) rest.setParentNode = parentId;
            flattened.push(rest);

            for (const child of children) {
                flatten(child, node.id);
            }
        };

        if (Array.isArray(parsedOriginal)) {
            parsedOriginal.forEach(obj => flatten(obj));
        } else {
            flatten(parsedOriginal);
        }

        this.flatList = flattened;
        this._deduplicate();
    }


    async mergeCode(snippet) {
        // Parse and flatten new snippet input
        const parsedSnippet = typeof snippet === 'string' ? JSON.parse(snippet) : snippet;
        const flattened = [];

        const flatten = (node, parentId = null) => {
            if (!node.id) node.id = this._generateUniqueId();

            const { children = [], ...rest } = node;
            if (parentId) rest.setParentNode = parentId;
            flattened.push(rest);

            for (const child of children) {
                flatten(child, node.id);
            }
        };

        if (Array.isArray(parsedSnippet)) {
            parsedSnippet.forEach(obj => flatten(obj));
        } else {
            flatten(parsedSnippet);
        }

        // Append new nodes to flatList and deduplicate
        this.flatList.push(...flattened);
        this._deduplicate();

        // Apply surgical merge behaviors
        await this._applyDeletes();
        await this._applyAttributeDeletes();
        await this._applyReparenting();
        await this._applyReordering();

        // Return final hierarchical output
        return JSON.stringify(this._buildTree(), null, 2);
    }



    _generateUniqueId() {
        return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    _ensureId(obj) {
        if (!obj.id) obj.id = this._generateUniqueId();
        return obj;
    }

    _setCodeAndFlatten(code) {
        const input = JSON.parse(code);
        const flat = [];

        const walk = (node, parentId = null) => {
            if (!node.id) node.id = this._generateUniqueId();
            const { children = [], ...rest } = node;
            if (parentId) rest.setParentNode = parentId;
            flat.push(rest);
            for (const child of children) walk(child, node.id);
        };

        if (Array.isArray(input)) {
            input.forEach(obj => walk(obj));
        } else {
            walk(input);
        }

        this.flatList = flat;
    }


    _deduplicate() {
        const deduped = [];
        this.idMap.clear();

        for (const obj of this.flatList) {
            if (this.idMap.has(obj.id)) {
                const existing = this.idMap.get(obj.id);
                this._mergeObject(existing, obj); // Merge patch into original
            } else {
                this.idMap.set(obj.id, obj);
                deduped.push(obj);
            }
        }

        this.flatList = deduped;
    }



    _mergeObject(base, patch) {
        for (const key in patch) {
            const val = patch[key];

            if (val === 'DELETE_THIS_ATTRIBUTE') {
                delete base[key];
            } else if (
                typeof val === 'object' &&
                val !== null &&
                typeof base[key] === 'object' &&
                base[key] !== null &&
                !Array.isArray(val)
            ) {
                base[key] = this._mergeObject(base[key], val);
            } else {
                base[key] = val;
            }
        }
        return base;
    }




    _applyDeletes() {
        this.deletedIds = new Set();
        for (const obj of this.flatList) {
            if (obj.DELETE_THIS_NODE) {
                this.deletedIds.add(obj.id);
            }
        }

        this.flatList = this.flatList.filter(obj => !this.deletedIds.has(obj.id));
    }



    _applyAttributeDeletes() {
        for (const obj of this.flatList) {
            for (const key in obj) {
                if (obj[key] === 'DELETE_THIS_ATTRIBUTE') {
                    delete obj[key];
                }
            }
        }
    }


    _applyReparenting() {
        for (const obj of this.flatList) {
            if (obj.setParentNode) {
                obj._parent = obj.setParentNode;
                delete obj.setParentNode;
            }
        }
    }


    _applyReordering() {
        for (const obj of this.flatList) {
            if (obj.moveBefore || obj.moveAfter) {
                obj._reorder = {
                    type: obj.moveBefore ? 'before' : 'after',
                    target: obj.moveBefore || obj.moveAfter
                };
                delete obj.moveBefore;
                delete obj.moveAfter;
            }
        }
    }


    _buildTree() {
        const idToNode = new Map(this.flatList.map(obj => [obj.id, obj]));
        const rootNodes = [];

        for (const obj of this.flatList) {
            if (this.deletedIds?.has(obj.id)) continue;

            const parentId = obj._parent;
            if (parentId && idToNode.has(parentId)) {
                const parent = idToNode.get(parentId);
                if (!Array.isArray(parent.children)) parent.children = [];
                parent.children.push(obj);
            } else {
                rootNodes.push(obj);
            }
        }

        // Reordering within siblings
        for (const obj of this.flatList) {
            if (obj._reorder && obj._parent) {
                const parent = idToNode.get(obj._parent);
                if (!parent || !Array.isArray(parent.children)) continue;

                const siblings = parent.children;
                const currentIndex = siblings.indexOf(obj);
                if (currentIndex !== -1) siblings.splice(currentIndex, 1);

                const targetIndex = siblings.findIndex(sib => sib.id === obj._reorder.target);
                if (targetIndex !== -1) {
                    const insertIndex = obj._reorder.type === 'before' ? targetIndex : targetIndex + 1;
                    siblings.splice(insertIndex, 0, obj);
                }

                delete obj._reorder;
            }
        }

        for (const obj of this.flatList) {
            delete obj._parent;
        }

        return rootNodes.length === 1 ? rootNodes[0] : rootNodes.length ? rootNodes : null;
    }





}


function deepEqual(a, b) {
    if (a === b) return true;

    if (a === null || b === null) return a === b;
    if (typeof a !== typeof b) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => deepEqual(item, b[index]));
    }

    if (typeof a === 'object') {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        aKeys.sort();
        bKeys.sort();
        for (let i = 0; i < aKeys.length; i++) {
            if (aKeys[i] !== bKeys[i]) return false;
        }
        return aKeys.every(key => deepEqual(a[key], b[key]));
    }

    return false;
}
