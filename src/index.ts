import {Stats} from 'fs'
import * as fse from 'fs-extra'
import * as del from 'del'
import path = require('path')
import bole = require('bole')

const logger = bole('link-dir')

async function linkDir (existingDir: string, newDir: string) {
  const stage = `${newDir}+stage`
  try {
    await del([stage])
    await hardlinkDir(existingDir, stage)
    await del([newDir])
    await fse.move(stage, newDir)
  } catch (err) {
    try { await del([stage]) } catch (err) {}
    throw err
  }
}

async function hardlinkDir(existingDir: string, newDir: string) {
  await fse.ensureDir(newDir)
  const dirs = await fse.readdir(existingDir)
  await Promise.all(
    dirs
      .map(async (relativePath: string) => {
        const existingPath = path.join(existingDir, relativePath)
        const newPath = path.join(newDir, relativePath)
        const stat: any = await fse.lstat(existingPath)
        if (stat.isSymbolicLink() || stat.isFile()) {
          return safeLink(existingPath, newPath, stat)
        }
        if (stat.isDirectory()) {
          return hardlinkDir(existingPath, newPath)
        }
      })
  )
}

async function safeLink(existingPath: string, newPath: string, stat: Stats) {
  try {
    await fse.link(existingPath, newPath)
  } catch (err) {
    // shouldn't normally happen, but if the file was already somehow linked,
    // the installation should not fail
    if (err.code === 'EEXIST') {
      return
    }
    // might happen if package contains a broken symlink, we don't fail on this
    if (err.code === 'ENOENT' && stat.isSymbolicLink()) {
      logger.warn({
        message: `Broken symlink found: ${existingPath}`,
      })
      return
    }
    throw err
  }
}

export { linkDir }

export default linkDir
