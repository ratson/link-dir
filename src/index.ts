import {Stats} from 'fs';
import path = require('path')
import fs = require('mz/fs')
import mkdirp = require('mkdirp-promise')
import rimraf = require('rimraf-then')
import bole = require('bole')

const logger = bole('link-dir')

async function linkDir (existingDir: string, newDir: string) {
  const stage = `${newDir}+stage`
  try {
    await rimraf(stage)
    await hardlinkDir(existingDir, stage)
    await rimraf(newDir)
    await fs.rename(stage, newDir)
  } catch (err) {
    try { await rimraf(stage) } catch (err) {}
    throw err
  }
}

async function hardlinkDir(existingDir: string, newDir: string) {
  await mkdirp(newDir)
  const dirs = await fs.readdir(existingDir)
  await Promise.all(
    dirs
      .map(async (relativePath: string) => {
        const existingPath = path.join(existingDir, relativePath)
        const newPath = path.join(newDir, relativePath)
        const stat: any = await fs.lstat(existingPath)
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
    await fs.link(existingPath, newPath)
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

// for backward compatibility
linkDir['default'] = linkDir

export = linkDir
