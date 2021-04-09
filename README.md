# babel-plugin-package-css-module

# About
Compile and use css module in npm package
- only support `less module` now
- less module files should end with `.module.less`

# Example
```json
/** .babelrc */
{
  "presets": [
    ...
  ],
  "plugins": [
    ["package-css-module", { "entry": "src", "output": ["lib", "es"] }],
    ...
  ]
}
```

```javascript
/** src/index.js */
import styles from './index.module.less';

      ↓ ↓ ↓ ↓ ↓ ↓

/**
 * es/index.js
 * 
 * src/index.module.less
 * ↓ ↓ ↓ ↓ ↓ ↓
 * es/index.module.css
 * es/index.module.css.js
 */
import './index.module.css';
import styles from './index.module.css.js';
```
