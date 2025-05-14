import { JsonManipulator } from "./JSON.js"; // Adjust the import path as necessary

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

function printDiff(expected, actual) {
    console.log("🔍 Diff:");
    console.log("Expected:", JSON.stringify(expected, null, 2));
    console.log("Actual:  ", JSON.stringify(actual, null, 2));
}

async function runJsonTests() {
    const tests = [
        {
            name: "Flat snippet with setParentNode",
            original: `[]`,
            snippet: JSON.stringify([
                { id: "form", type: "form" },
                { id: "email", type: "input", setParentNode: "form" }
            ]),
            expect: {
                id: "form",
                type: "form",
                children: [
                    { id: "email", type: "input" }
                ]
            }
        },
        {
            name: "Nested snippet with children",
            original: `[]`,
            snippet: JSON.stringify({
                id: "form",
                type: "form",
                children: [
                    { id: "email", type: "input" }
                ]
            }),
            expect: {
                id: "form",
                type: "form",
                children: [
                    { id: "email", type: "input" }
                ]
            }
        },
        {
            name: "Reordering with moveAfter",
            original: JSON.stringify([
                { id: "a", label: "A" },
                { id: "b", label: "B", setParentNode: "a" },
                { id: "c", label: "C", setParentNode: "a" }
            ]),
            snippet: JSON.stringify([
                { id: "c", moveAfter: "b" }
            ]),
            expect: {
                id: "a",
                label: "A",
                children: [
                    { id: "b", label: "B" },
                    { id: "c", label: "C" }
                ]
            }
        },
        {
            name: "DELETE_THIS_NODE removes object",
            original: JSON.stringify([
                { id: "container", type: "box" },
                { id: "deprecated", type: "legacy", setParentNode: "container" }
            ]),
            snippet: JSON.stringify([
                { id: "deprecated", DELETE_THIS_NODE: true }
            ]),
            expect: {
                id: "container",
                type: "box"
            }
        },
        {
            name: "DELETE_THIS_ATTRIBUTE removes property",
            original: JSON.stringify([
                { id: "field", label: "Name", placeholder: "Enter name" }
            ]),
            snippet: JSON.stringify([
                { id: "field", placeholder: "DELETE_THIS_ATTRIBUTE" }
            ]),
            expect: {
                id: "field",
                label: "Name"
            }
        },
        {
            name: "Duplicate IDs are merged (flat)",
            original: JSON.stringify([
                { id: "profile", title: "User Profile" }
            ]),
            snippet: JSON.stringify([
                { id: "profile", description: "Details here" }
            ]),
            expect: {
                id: "profile",
                title: "User Profile",
                description: "Details here"
            }
        },
        {
            name: "Duplicate IDs are merged (nested)",
            original: JSON.stringify([
                { id: "card", type: "info" }
            ]),
            snippet: JSON.stringify({
                id: "card",
                title: "Welcome",
                children: [
                    { id: "btn", type: "button" }
                ]
            }),
            expect: {
                id: "card",
                type: "info",
                title: "Welcome",
                children: [
                    { id: "btn", type: "button" }
                ]
            }
        }
    ];

    let passCount = 0;

    for (const test of tests) {
        console.log(`\n--- Running Test: ${test.name} ---`);

        try {
            const manipulator = new JsonManipulator();
            await manipulator.setCode(test.original);
            const result = await manipulator.mergeCode(test.snippet);
            const resultObj = result ? JSON.parse(result) : null;

            const pass = deepEqual(resultObj, test.expect);

            if (pass) {
                console.log("✅ PASS");
                passCount++;
            } else {
                console.log("❌ FAIL");
                printDiff(test.expect, resultObj);
            }

        } catch (e) {
            console.log("❌ ERROR during test execution");
            console.error(e);
        }
    }

    console.log(`\n✅ ${passCount}/${tests.length} tests passed.`);
}

runJsonTests();
