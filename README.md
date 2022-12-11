# tuoyingtao-applet 小程序启动模板

## 技术架构
### 开发环境
* Node:`14.14.0`
* npm: `6.14.8`
* Vue: `@vue/cli 4.5.14`
* VueX: `3.2.0`
* node-sass: `4.14.1`
* sass-loader: `10.1.1`
* dayjs: `1.11.7`
* uni-read-pages: `1.0.5`
  @vue/cli 5.0.8
* postcss-loader、autoprefixer:（解决报错：`Error: PostCSS plugin autoprefixer requires PostCSS 8.·）
  `npm i postcss-loader autoprefixer@8.0.0`
* uniapp-weapp-starter-template
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 关于vant-weapp组件

放在`wxcomponents`目录中的一切文件，无论是否使用，都会被打包。
整个 vant 所有组件体积为374k，可使用小程序的依赖分析查看

	考虑到体积优化问题，本仓库将完整的vant组件放在外层的 `/elemtn-ui/vant-weapp` 目录中。
	如需使用里面的组件，再自行Copy到 `/wxcomponents/vant/` 目录中


### 如何使用

例如使用 `<van-button>` 组件
1. 从 `/elemtn-ui/vant-weapp` 中复制 button 目录到 `/src/wxcomponents/vant/` 中
2. 在 `/src/page.json` 中配置
```json
"globalStyle": {
    "usingComponents": {
        "van-button": "/wxcomponents/vant/button/index",
    }
}
```
3. 检查该组件的依赖项有些组件依赖了`common/`下的js，有些组件则依赖了其他组件可通过该组件中的 `xxx.json` 查看，或直接看编译器提示这里`button`组件这里依赖了`loading`和`icon`组件，也需要一并移入并在`page.json`中配置 一般来说，这几个目录是所有组件都依赖的`common`、`wxs`、`mixins`。
4.  页面中使用 <van-button>按钮</van-button>
