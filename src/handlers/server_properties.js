const vscode = require('vscode');

const props = require("../data/server_properties.json")

module.exports = {
    /**
     * @type {vscode.DocumentSelector}
     */
    selector: {
        //pattern: "**/server.properties",
        language: "properties",
    },
    /**
     * @type {vscode.HoverProvider}
     */
    hover: {
        provideHover(doc, pos, ct) {
            let line = doc.lineAt(pos.line);
            let [propName, propValue] = line.text.split("=");

            if (!propName || !props[propName]) return;

            return new vscode.Hover(
                new vscode.MarkdownString(`\`${propName}\`: ${props[propName].desc}\n\nDefault: \`${props[propName].default}\`\n\n Type: \`${props[propName].type}\``)
            )
        }
    },

    /**
     * @type {vscode.CompletionItemProvider<vscode.CompletionItem>}
     */
    completion: {
        provideCompletionItems(doc, pos, ct, ctx) {
            try {
                let line = doc.lineAt(pos.line);

                let isAtPropName = !line.text.includes("=") || pos.character <= line.text.indexOf("=");

                if (isAtPropName) {
                    return Object.entries(props).map(([key, val]) => {
                        return new vscode.CompletionItem({
                            label: key,
                            detail: "=" + val.default,
                            description: val.desc,
                        }, vscode.CompletionItemKind.Property);
                    });
                } else {
                    let [propName, propValue] = line.text.split("=");

                    let val = props[propName];
                    if (!val) return;

                    let sugs = {
                        bool: () => [
                            new vscode.CompletionItem("true", vscode.CompletionItemKind.Value),
                            new vscode.CompletionItem("false", vscode.CompletionItemKind.Value),
                        ],
                        enum: () => Array.isArray(val.values) ? val.values.map(v => {
                            if (typeof v === "string") {
                                return new vscode.CompletionItem(v, vscode.CompletionItemKind.EnumMember);
                            } else {
                                return []
                            }
                        }) : [],
                    };

                    if (sugs[val.type]) return sugs[val.type]();
                }
            } catch (e) { console.log(e) }
        }
    }
};