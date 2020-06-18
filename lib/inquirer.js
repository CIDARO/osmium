const inquirer = require('inquirer');
const { getFilesFromFolder } = require('./utils');
const backups = require('../backup-agent/backups.json');

module.exports = {
    askBackup: () => {
        const questions = [
            {
                name: 'backup',
                type: 'list',
                message: 'What backup do you want to restore?',
                default: 0,
                choices: backups.map((backup) => backup.name),
                validate: function (value) {
                    return true;
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askBackupFile: async (backupName) => {
        const files = await getFilesFromFolder(`/backups/${backupName}`);
        const questions = [
            {
                name: 'backupFile',
                type: 'list',
                message: 'What backup file do you want to restore?',
                default: 0,
                choices: files,
                validate: function(value) {
                    return true;
                }
            }
        ];
        return inquirer.prompt(questions);
    }
}