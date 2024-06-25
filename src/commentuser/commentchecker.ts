import * as vscode from "vscode";

export interface CommentCheckResult {
  name: string;
  comment: string[]; // Update to store multiple comments
  hasComment: boolean;
  className: string;
}

export interface FileAnalysisResult {
  functions: CommentCheckResult[];
  classes: ClassesResult[];
}

export interface ClassesResult {
  class_name: string;
  hasComment: boolean;
  comment: string[]; // Update to store multiple comments
}
function immediateSmallerNumber(arr: number[], num: number): number {
  // Sort the array
  arr.sort((a, b) => a - b);

  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] >= num) {
      right = mid - 1;
    } else {
      result = arr[mid];
      left = mid + 1;
    }
  }

  return result;
}

export function checkComments(
  content: string,
  filename: string
): Promise<FileAnalysisResult> {
  return new Promise((resolve, reject) => {
    if (!content || !filename) {
      reject("Invalid content or filename");
      return;
    }

    const methodRegex =
      /(?:public|protected|private|internal|static|\s)+[\w\<\>\[\]]+\s+(\w+)\s*\([^)]*\)\s*{/g;
    const classRegex = /class\s+(\w+)\s*{/g;
    const commentRegex =
      /\/\/[^\n]*|\/\*[\s\S]*?\*\/|\/\/\/[^\n]*(?:\n\/\/\/[^\n]*)*/g;

    const methods: RegExpExecArray[] = [];
    const classes: RegExpExecArray[] = [];
    const comments: RegExpExecArray[] = [];

    let match;
    while ((match = methodRegex.exec(content)) !== null) {
      methods.push(match);
    }
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match);
    }
    while ((match = commentRegex.exec(content)) !== null) {
      comments.push(match);
    }

    const result: FileAnalysisResult = {
      functions: [],
      classes: [],
    };

    const classMap = new Map<number, string>();
    classes.forEach((cls) => {
      const className = cls[1];
      if (cls.index !== undefined) {
        const classStartIndex = cls.index;
        classMap.set(classStartIndex, className);
      }
    });

    const findClassName = (methodIndex: number): string => {
      let className = "null";
      for (let [classIndex, name] of classMap) {
        if (classIndex < methodIndex) {
          className = name;
        } else {
          break;
        }
      }
      return className;
    };

    const findCommentsBefore = (
      index: number,
      prevIndex: number | null
    ): RegExpExecArray[] => {
      let precedingComments: RegExpExecArray[];
      if (prevIndex !== null) {
        precedingComments = comments.filter(
          (comment) =>
            comment.index !== undefined &&
            comment.index < index &&
            comment.index > prevIndex
        );
      } else {
        precedingComments = comments.filter(
          (comment) => comment.index !== undefined && comment.index < index
        );
      }

      const collectedComments: RegExpExecArray[] = [];
      for (let i = precedingComments.length - 1; i >= 0; i--) {
        const comment = precedingComments[i];
        // if (
        //   // collectedComments.length === 0 ||
        //   // (comment.index !== undefined &&
        //   //   collectedComments[0].index !== undefined &&
        //   //   collectedComments[0].index - comment.index ===
        //   //     comment[0].length + 1)
        // ) {
        collectedComments.unshift(comment);
        // } else {
        //   break;
        // }
      }
      return collectedComments;
    };

    const extractCommentText = (
      commentMatches: RegExpExecArray[]
    ): string[] => {
      return commentMatches.map((comment) => comment[0]);
    };

    // methods.forEach((method) => {
    let maxLength =
      methods.length > classes.length ? methods.length : classes.length;

    let methodIndexes = methods.map((method) => {
      return method.index;
    });
    let classIndexes = classes.map((cls) => {
      return cls.index;
    });
    let classMethodIndexes = methodIndexes.concat(...classIndexes);

    for (let i = 0; i < maxLength; i++) {
      if (methods[i]) {
        let method = methods[i];
        const methodName = method[1];
        const prevMethodIndex = immediateSmallerNumber(
          classMethodIndexes,
          method.index
        );

        if (method.index !== undefined) {
          const methodStartIndex = method.index;
          const className = findClassName(methodStartIndex);

          const methodComments = findCommentsBefore(
            methodStartIndex,
            prevMethodIndex
          );

          const hasValidComment = methodComments.some(
            (comment) =>
              comment[0].trim() !== "//" &&
              comment[0].trim() !== "///" &&
              comment[0].trim() !== "/* */"
          );

          result.functions.push({
            name: methodName,
            className: className,
            comment: hasValidComment ? extractCommentText(methodComments) : [],
            hasComment: !!methodComments.length && hasValidComment,
          });
        }
      }
      if (classes[i]) {
        let cls = classes[i];
        const className = cls[1];
        if (cls.index !== undefined) {
          const classStartIndex = cls.index;
          const prevClassIndex = immediateSmallerNumber(
            classMethodIndexes,
            cls.index
          );

          const classComments = findCommentsBefore(
            classStartIndex,
            prevClassIndex
          );

          const hasValidComment = classComments.some(
            (comment) =>
              comment[0].trim() !== "//" &&
              comment[0].trim() !== "///" &&
              comment[0].trim() !== "/* */"
          );

          result.classes.push({
            class_name: className,
            comment: hasValidComment ? extractCommentText(classComments) : [],
            hasComment: !!classComments.length && hasValidComment,
          });
        }
      }
    }
    resolve(result);
  });
}

// Function to extract content from comments (single-line, multi-line, and XML)
function extractCommentContent(comment: string): string {
  const singleLineMatch = comment.match(/^\/\/\s*(.*)$/);
  if (singleLineMatch) {
    return singleLineMatch[1].trim();
  }

  const multiLineMatch = comment.match(/^\/\*\s*([\s\S]*?)\s*\*\/$/);
  if (multiLineMatch) {
    return multiLineMatch[1].replace(/^\s*\*+/gm, "").trim();
  }

  const xmlCommentMatch = comment.match(/^\/\/\/\s*(.*)$/gm);
  if (xmlCommentMatch) {
    return xmlCommentMatch
      .map((line) => line.replace(/^\/\/\//, "").trim())
      .join("\n");
  }

  return comment.trim();
}
