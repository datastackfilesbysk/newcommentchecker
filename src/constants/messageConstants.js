"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message_Constants = void 0;
class Message_Constants {
    static COMMAND_ERROR_MESSAGE = "This command only works on C# files.";
    static INFO_MSG = `Found {A} classes and  {B} functions with comments`;
    static FUNCTION_NAME = `Function {func.name} lacks comments`;
    static CLASS_NAME = `Class '{cls.name}' lacks comments`;
    static PROCESSING_FILE_ERROR_MSG = `Error processing the C# file: {errorMessage}`;
    static REVIEW_COMMENT_ERROR_MSG = `Error executing the review comments command: {errorMessage}`;
    static EXTRACT_COMMENT_ERROR_MSG = `Error extracting comments: {errorMessage}`;
    static EXTRACT_DETAILS_ERROR_MSG = `Error extracting details: {errorMessage}`;
}
exports.Message_Constants = Message_Constants;
//# sourceMappingURL=messageConstants.js.map