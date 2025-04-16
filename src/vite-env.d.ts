/// <reference types="vite/client" />

// Add this module declaration for SVG imports as React components
declare module '*.svg?react' {
  import React = require('react');
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
