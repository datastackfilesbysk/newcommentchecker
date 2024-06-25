# Code Comment Reviewer

## Overview

The Code Comment Reviewer is a Visual Studio Code extension designed to help developers review and manage comments within their codebase efficiently. It highlights and categorizes comments, allowing for easy tracking and review. This tool is especially useful for code reviews and maintaining clean, well-documented code.

## Features

- **Highlight and Categorize Comments**: Automatically detect and categorize different types of comments (e.g., TODOs, FIXMEs).
- **Generate Comment Summary Reports**: Quickly generate a summary report of all comments in your project.
- **Integrate with Issue Trackers**: Link comments to issues in popular issue tracking systems.

<!-- ![Feature Highlight](images/feature-highlight.png) -->

## Requirements

This extension requires Node.js and npm to be installed on your system. Ensure you have the latest versions:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Extension Settings

This extension contributes the following settings:

- `codeCommentReviewer.enable`: Enable/disable the Code Comment Reviewer extension.
- `codeCommentReviewer.reportFormat`: Choose the format for the summary report (e.g., `markdown`, `html`).

## Known Issues

- Currently, the extension may not detect comments in some non-standard file formats.
- Performance may be affected in very large codebases.

## Release Notes

### 1.0.0

- Initial release of Code Comment Reviewer.
- Basic comment highlighting and categorization.

### 1.1.0

- Added integration with popular issue trackers.
- Improved performance for large projects.

---

## Following Extension Guidelines

Ensure that you've read through the extension guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For More Information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
