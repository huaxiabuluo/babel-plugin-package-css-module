export interface IOptions {
  entry: string;
  output: string[];
  /**
   * list of queries for target browsers.
   * Try to not use it.
   * The best practice is to use `.browserslistrc` config or `browserslist` key in `package.json`
   * to share target browsers with Babel, ESLint and Stylelint
   * 
   * e.g: ['> 1% in CN', 'last 2 versions', 'ios >= 9', 'Android >= 4.4']
   */
  overrideBrowserslist?: string | string[];
}