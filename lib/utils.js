const fs = require('fs');

module.exports = {
    folderExists: (folder) => {
        return new Promise((resolve, reject) => {
            resolve(fs.existsSync(folder));
        })
    },
    createFolder: (folder) => {
        return new Promise((resolve, reject) => {
            resolve(fs.mkdirSync(folder));
        })
    },
    getFilesFromFolder: (folder) => {
        return new Promise((resolve, reject) => {
            resolve(fs.readdirSync(folder));
        })
    },
    deleteFile: (filePath) => {
        return new Promise((resolve, reject) => {
            resolve(fs.unlinkSync(filePath));
        })
    }
}