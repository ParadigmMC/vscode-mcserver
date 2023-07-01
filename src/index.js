const vscode = require('vscode');

let server_properties = require("./handlers/server_properties")

/**
 * @param {vscode.ExtensionContext} ctx
 */
function activate(ctx) {
	vscode.languages.registerHoverProvider(server_properties.selector, server_properties.hover);
	vscode.languages.registerCompletionItemProvider(server_properties.selector, server_properties.completion);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
