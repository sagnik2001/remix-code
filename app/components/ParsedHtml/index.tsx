import { parseHTMLStringToJSX } from "~/utils/parser";
import React from "react";

const ParsedHtml = ({ content,customClassName='' }) => {
  const jsxElements = parseHTMLStringToJSX(content);
  return <div className={customClassName}>{jsxElements}</div>;
};

export default ParsedHtml;
