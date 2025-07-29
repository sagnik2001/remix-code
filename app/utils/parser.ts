import React from "react";
import { isNonEmptyString } from "./checks";

export const parseHTMLStringToJSX = (htmlString) => {
  if(!isNonEmptyString(htmlString))
    return '';
  
  // Create a temporary DOM element to parse the HTML string
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString.trim();

  // Extract child nodes from the temporary element
  const childNodes = tempElement.childNodes;

  // Function to recursively convert child nodes to React elements
  const convertNodeToReact = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      const props = {};
      // Handle style attribute for inline styles
      if (node.getAttribute('style')) {
        props.style = {};
        node.getAttribute('style').split(';').forEach(style => {
          const [key, value] = style.split(':');
          if (key.trim() && value.trim()) {
            props.style[key.trim()] = value.trim();
          }
        });
      }

      // Handle attributes other than style
      for (let attr of node.attributes) {
        if (attr.name !== 'style') {
          props[attr.name] = attr.value;
        }
      }

      // Recursively convert child nodes
      const children = Array.from(node.childNodes).map(childNode => convertNodeToReact(childNode));

      return React.createElement(tagName, props, ...children);
    }
    return null;
  };

  // Convert each child node to React elements
  const jsxElements = Array.from(childNodes).map(node => convertNodeToReact(node));

  return jsxElements;
};

export const parseAmountValue = (amount: string) => {
  if(!isNonEmptyString(amount))
    return amount;
  
  // Use a regular expression to find the number
  const match = amount.match(/(\d+(\.\d+)?)/);

  // Check if a match was found and get the first capture group
  const number = match ? parseFloat(match[0]) : null;

  return number;
}

export const convertToBase64 = (file: File) => {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};