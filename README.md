# link-dir

> Cross-platform directory linking

<!--@shields('npm', 'travis', 'appveyor')-->
[![npm version](https://img.shields.io/npm/v/link-dir.svg)](https://www.npmjs.com/package/link-dir) [![Build Status](https://img.shields.io/travis/zkochan/link-dir/master.svg)](https://travis-ci.org/zkochan/link-dir) [![Build Status on Windows](https://img.shields.io/appveyor/ci/zkochan/link-dir/master.svg)](https://ci.appveyor.com/project/zkochan/link-dir/branch/master)
<!--/@-->

Always uses "junctions" on Windows. Even though support for "symbolic links" was added in Vista+, users by default
lack permission to create them 

## Installation

```sh
npm i -S link-dir
```

## Usage

<!--@example('./example.js')-->
```js
'use strict'
const linkDir = require('link-dir').default
const path = require('path')
const cwd = process.cwd()

linkDir(path.join(cwd, 'src'), path.join(cwd, 'node_modules/src'))
```
<!--/@-->

## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
