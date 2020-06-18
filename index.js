#!/usr/bin/env node

/**
 * Osmium Restore Server - CIDARO Open Source MongoDB restorer
 * Proudly developed by Paolo Rollo
 * ©2020 CIDARO srl - MIT License
 */
const { spawn } = require('child_process');
const CLI = require('clui');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('./lib/inquirer');
const backups = require('./backup-agent/backups.json');
const Spinner = CLI.Spinner;

const run = async () => {
    try {
        // Clear the terminal
        clear();
        // Log the figlet logo
        console.log(
            chalk.blue(
                figlet.textSync('Osmium', { horizontalLayout: 'full' })
            )
        );
        // Retrieve the backup
        const backupResult = await inquirer.askBackup();
        const { backup } = backupResult;
        // Retrieve the backup file
        const backupFileResult = await inquirer.askBackupFile(backup);
        const { backupFile } = backupFileResult;
        // Retrieve the backup from the name
        const [ filteredBackup ] = backups.filter((b) => b.name === backup);
        const { host, port, dbName, name, username, password } = filteredBackup;
        // Create the options for the mongodump command
        const opts = [
            '--host', host,
            '--port', port,
            '--db', dbName,
            `--archive=/backups/${name}/${backupFile}`,
            '--gzip'
        ];        
        // If username and password are provided append them to the opts array
        if (username && password) {
            opts.concat([
                '--username', username,
                '--password', password
            ])
        }
        // Spawn the mongodump command
        const status = new Spinner('>> Restoring the database..');
        const restoreDB = spawn('mongorestore', opts);
        restoreDB
            .on("error", (err) => {
                status.stop();
                console.log(chalk.red("Error while restoring the database:"), err);
            })
            .on("close", (code) => {
                status.stop();
                console.log(chalk.green(`Database restored successfully! [Exit code: ${code}]`))
            })
    } catch (err) {
        console.log(chalk.red("An error occurred:"), err);
        console.log(chalk.red("Exiting gratefully."));
        process.exit(1);
    }
}

run();