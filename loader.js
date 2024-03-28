const BABEL_OPTIONS = {
  configFile: false,
  ast: true,
  parserOpts: {
    sourceType: "module",
    plugins: [
      "jsx",
      "asyncFunctions",
      "classConstructorCall",
      "doExpressions",
      "trailingFunctionCommas",
      "objectRestSpread",
      "decoratorsLegacy",
      "classProperties",
      "exportExtensions",
      "exponentiationOperator",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport",
      "optionalChaining",
      "typescript",
    ],
  },
};

const babel = require("@babel/core");
const generate = require("@babel/generator").default;
const t = require("@babel/types");

module.exports = function (source) {
  const callback = this.async();
  if (!source.includes("use client")) {
    callback(null, source);
    return;
  }

  const ast = babel.parse(source, BABEL_OPTIONS);
  babel.traverse(ast, {
    JSXOpeningElement(path) {
      const existingClassNameAttr = path.node.attributes.find(
        (attr) => attr.name && attr.name.name === "className"
      );

      const classToAdd = "csr-component";

      if (existingClassNameAttr) {
        if (t.isStringLiteral(existingClassNameAttr.value)) {
          existingClassNameAttr.value.value += ` ${classToAdd}`;
        } else if (t.isJSXExpressionContainer(existingClassNameAttr.value)) {
          existingClassNameAttr.value = t.jsxExpressionContainer(
            t.binaryExpression(
              "+",
              existingClassNameAttr.value.expression,
              t.stringLiteral(` ${classToAdd}`)
            )
          );
        }
      } else {
        const classNameAttr = t.jSXAttribute(
          t.jSXIdentifier("className"),
          t.stringLiteral(classToAdd)
        );
        path.node.attributes.push(classNameAttr);
      }
    },
  });

  const output = generate(ast, {}, source);
  callback(null, output.code);
};
