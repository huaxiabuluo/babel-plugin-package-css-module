import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { addSideEffect } from '@babel/helper-module-imports';
import compileLess from './less-compile';

export default function() {
  /** keep global `styles` Identifier */
  // let stylesIdentifier = undefined as t.Identifier;
  return {
    visitor: {
      Program: {
        enter(_path: NodePath<t.Program>, { opts }: { opts: { src: string; output: string[] } }) {
          compileLess(opts.src, opts.output);
        },
        exit() {
          // stylesIdentifier = undefined;
        },
      },
      ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
        const { specifiers, source } = path.node;
        /** only match `import xx from 'xxx.module.less'` */
        const isValid =
          specifiers.length === 1 &&
          t.isImportDefaultSpecifier(specifiers[0]) &&
          source.value?.endsWith('.module.less');

        if (!isValid) {
          return;
        }

        /**
         * import styles from './index.module.less'
         * keep `styles` Identifier
         */
        // stylesIdentifier = specifiers[0].local;

        /** add `import './index.module.css'` */
        addSideEffect(path, source.value.replace('less', 'css'));

        /**
         * from --> import styles from './index.module.less'
         * to --> import styles './index.module.css.js'
         */
        source.value = source.value.replace('less', 'css.js');
      },
      /**
       * styels = { a: 'cn' }
       * replace `styles.a` with string `cn`
       */
      // MemberExpression(path: NodePath<t.MemberExpression>) {
      //   const { object } = path.node;
      //   if (!stylesIdentifier || !(t.isIdentifier(object) && object.name === stylesIdentifier.name)) {
      //     return;
      //   }
      //   /** traverse `styles.a` */
      //   path.traverse({
      //     Identifier(p) {
      //       /** if `styles` is global */
      //       if (p.scope.getBindingIdentifier(stylesIdentifier.name) === stylesIdentifier) {
      //         const parentPath = p.parentPath as NodePath<t.MemberExpression>;
      //         const { node } = parentPath;
      //         if (t.isMemberExpression(node) && t.isIdentifier(node.property)) {
      //           parentPath.replaceWith(t.stringLiteral(node.property.name));
      //         }
      //       }
      //     },
      //   });
      // },
    },
  };
}
