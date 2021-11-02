const { readFile, writeFile, appendFile, readdir, rm } = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

class SimpleDB {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  getPath(id) {
    return path.join(this.rootDir, `${id}.json`);
  }

  save(file) {
    this.id = `${shortid.generate()}`;
    file.id = this.id;
    const fileName = `${file.id}.json`;
    this.newFile = path.join(this.rootDir, fileName);
    const stringyObject = JSON.stringify(file);
    return writeFile(this.newFile, stringyObject);
  }

  get(id) {
    const filePath = this.getPath(id);
    return readFile(filePath, JSON)
      .then((unstrungFile) => JSON.parse(unstrungFile))
      .catch((err) => {
        if (err.code === 'ENOENT') {
          return null;
        }
        throw err;
      });
  }

  async getAll() {
    const allFiles = await readdir(this.rootDir);
    const filePromise = await Promise.all(
      allFiles.map((fileName) =>
        readFile(`${this.rootDir}/${fileName}`, JSON)
          .then((unstrungFile) => JSON.parse(unstrungFile))
          .catch((err) => {
            if (err.code === 'ENOENT') {
              return null;
            }
            throw err;
          })
      )
    );
    return filePromise;
  }

  remove(id) {
    const filePath = this.getPath(id);
    return rm(filePath, { force: true }).catch((err) => {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    });
  }

  // update(id, update) {
  //   const dataObj = JSON.parse(this.getPath(id));
  //   dataObj.push(update);
  //   const newObj = JSON.stringify(dataObj);
  //   writeFile(newObj);
  // }
}

module.exports = SimpleDB;
