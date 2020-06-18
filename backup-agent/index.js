/**
 * Osmium Backup Agent - CIDARO Open Source MongoDB dump creator
 * Proudly developed by Paolo Rollo
 * ©2020 CIDARO srl - MIT License
 */
const { spawn } = require('child_process');
const { createFolder, folderExists, getFilesFromFolder, deleteFile } = require('../lib/utils');
const backups = require('./backups.json');


const run = async () => {
    try {
        // Check if the backups folder exists
        const backupFolderExists = await folderExists('/backups');
        // If it does not exist, create it
        if (!backupFolderExists) {
            await createFolder('/backups')
        }
        // Iterate through all the backups
        backups.forEach(async (backup) => {
            // Retrieve the backup information
            const { name, host, port, dbName, username, password, retain } = backup;
            // Create the folder name for the backup
            const folderName = `/backups/${name}`;
            // Check if the host folder exists
            const hostFolderExists = await folderExists(folderName);
            // If it does not exist, create it
            if (!hostFolderExists) {
                await createFolder(folderName);
            }
            // Retrieve all the files from the folder
            let files = await getFilesFromFolder(folderName);
            // Get the files count
            let filesCount = files.length;
            // If the current files count is ge than the retain, we must delete one
            if (filesCount >= retain) {
                // Sort all the files based on their number after a dash
                files = files.sort((a, b) => {
                    const aCount = parseInt(a.split('-')[1]);
                    const bCount = parseInt(b.split('-')[1]);
                    return aCount - bCount;
                })
                // The file to delete it's the first one
                const fileToDelete = files[0];
                // The file that updates the 'filesCount' variable for later is the last one
                const latestFile = files[filesCount - 1];
                filesCount = parseInt(latestFile.split('-')[1]);
                // Delete the file
                await deleteFile(`${folderName}/${fileToDelete}`);
            }
            // Create the backup name file
            const backupName = `${name}-${filesCount+1}.gz`;
            // Create the options for the mongodump command
            const opts = [
                '--host', host,
                '--port', port,
                '--db', dbName,
                `--archive=/backups/${name}/${backupName}`,
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
            spawn('mongodump', opts);
        })
    } catch (err) {
        console.log(chalk.red("An error occurred:"), err);
        console.log(chalk.red("Exiting gratefully."));
        process.exit(1);
    }
}

run();