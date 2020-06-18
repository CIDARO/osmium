<div align="center">
  <br/>
  <img src="./osmium.png" width="200" />
  <br/>
  <br/>
  <p>
    Open Source tool that dumps and restores MongoDB databases.
  </p>
  <p>
    version 1.0.0
  </p>
  <br/>
  <p>
    <a href="#status"><strong>Status</strong></a> ·
    <a href="#description"><strong>Description</strong></a> ·
    <a href="#install"><strong>Install</strong></a>
  </p>
</div>

---

## Status

**Osmium** is currently in **beta** version and it's being tested in production.

---

## Description

**Osmium** is a simple agent/CLI tool that dumps and restores MongoDB databases in NodeJS.

It is currently made of 2 different tools:
- **osmium-backup-agent** is a crontab that runs everyday and creates the backups from the `backup.json` file;
- **osmium** is a CLI that allows the user to recover a recently created backup from the agent.

All the MongoDB backups are stored inside the `/backups` folder (and its subdirectories) in a `.gz` format.

---

## Install

In order to use Osmium you must clone this repository:

```bash
git clone https://github.com/CIDARO/osmium
```

Now you have to edit the `backup-agent/backups.example.json` and rename it into `backup-agent/backups.json`.

The file has the following structure:

```
[
    {
        "name": "", // name of the backup or w/e you want as long as you can understand it
        "host": "", // MongoDB host (eg. localhost)
        "port": "", // MongoDB port (eg. 27017)
        "username": null, // MongoDB username if enabled, otherwise leave it null
        "password": null, // MongoDB password if enabled, otherwise leave it null
        "retain": 2 // Number of backups that must be retained
    }
]
```

### Docker

If you want to run Osmium inside a Docker container you can run the following commands:

```bash
cd osmium # or wherever you cloned this repo in
docker build -t osmium:latest .
docker run -it --rm -d -v DATA_PATH:/backups osmium:latest
```

### Standalone

If you don't have Docker installed or you just want to run it locally, you must have the following prerequisites:
- `mongodb-org-tools` - used for the `mongorestore` and `mongodump` commands;
- `cron` - used to run the osmium-backup-agent;
- `node` - used to run pretty much everything.

Currently the agent is running with the following cron expression: `0 0 * * *`.

This means it will be executed everyday. You can change it to whatever you want by simply modifying the `startAgent.sh` file.

If you want to generate a crontab schedule expression we suggest you using this <a href="https://crontab.guru/">website</a>.

Run the following commands:

```bash
cd osmium # or wherever you cloned this repo in
chmod +x startAgent.sh
./startAgent.sh # starts the osmium-backup-agent
npm install -g # installs the osmium CLI globally
```

After you're all setup and ready, you can run `osmium` in your terminal to restore a MongoDB backup.

If you want to create a backup without waiting for the crontab you can just simply run:

```bash
node backup-agent/index.js
```

This will create a new backup for all the databases specified in the `backups.json` file.

All the backups are available in the `/backups` folder!

---

## Contributing

We welcome community contributions!

Please check out our <a href="https://github.com/CIDARO/osmium/issues">open issues</a> to get started.

If you discover something that could potentially impact security, please notify us immediately by sending an e-mail at <a href="mailto:support@cidaro.com">support@cidaro.com</a>. We'll get in touch with you as fast as we can!
