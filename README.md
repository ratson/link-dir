# @frat/link-dir

> Link directory

<!--@shields('npm')-->
[![npm version](https://img.shields.io/npm/v/@frat/link-dir.svg)](https://www.npmjs.com/package/@frat/link-dir)
<!--/@-->

Link each file in a directory recursively.

## Installation

```sh
npm i -S @frat/link-dir
```

## CLI Usage

```sh
# from -> to
link-dir . node_modules/my-package
```

## API Usage

<!--@example('./example.js')-->
```js
'use strict'
const { linkDir } = require('@frat/link-dir')
const path = require('path')
const cwd = process.cwd()

linkDir(path.join(cwd, 'src'), path.join(cwd, 'node_modules/src'))
```
<!--/@-->

## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
