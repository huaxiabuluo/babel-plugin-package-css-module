import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import assert from 'assert';
import postCssModules from 'postcss-modules';
import less from 'less';
import mkdirp from 'mkdirp';

export default function fileGenerator(sourcePath: string, output = ['es', 'lib']) {
  const pathStat = fs.statSync(sourcePath);

  /** 编译处理后缀名为 .module.less 的文件 */
  if (pathStat.isFile() && /\.module\.less$/.test(sourcePath)) {
    const lessStr = fs.readFileSync(sourcePath, { encoding: 'utf-8' });
    // less.render(lessStr, { javascriptEnabled: true })
    /** 编译 less 文件 */
    less.render(lessStr, { javascriptEnabled: true }, (err, data) => {
      assert(!err, JSON.stringify(err));
      // const buildFolder = path.dirname(sourcePath).replace('src', output);
      output.forEach(folderName => mkdirp.sync(path.dirname(sourcePath).replace('src', folderName)));
      const fileBuildPaths = output.map(folderName => sourcePath.replace('src', folderName).replace('.less', ''));
      postcss([
        /** autoprefixer: 浏览器兼容 */
        autoprefixer({ overrideBrowserslist: ['> 1% in CN', 'last 2 versions', 'ios >= 9', 'Android >= 4.4'] }),
        /** 输出 json 文件 */
        postCssModules({
          getJSON: function(_cssFileName: string, json: Record<string, string>, _outputFileName: string) {
            fileBuildPaths.forEach(p => fs.writeFileSync(`${p}.css.js`, `module.exports=${JSON.stringify(json)}`));
          },
        }),
      ])
        .process(data.css, { from: undefined })
        .then(result => {
          /** 输出编译后的 css 文件 */
          fileBuildPaths.forEach(p => fs.writeFileSync(`${p}.css`, result.css, { encoding: 'utf-8' }));
        });
    });

    /** 文件夹 */
  } else if (pathStat.isDirectory()) {
    const children = fs.readdirSync(sourcePath).map(name => path.join(sourcePath, name));
    children.forEach(p => fileGenerator(p));
  }
}
