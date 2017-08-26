# oregon-trail

'Oregon Trail' computer game implemented as an express web application. Game data saved into database using sequelize.

### Local Installation
---
Start by cloning and entering the project repo:

```
git clone https://github.com/alextickle/oregon-trail
cd oregon-trail
```

Once you've downloaded the project, install dependencies:

```
npm install
```

You will then need to update the config.json file in the config directory to match your local postgres account

### Create, Format, and Seed Database
---

Once signed into postgres with the postgres cli (psql -U username), enter the following command:

```
CREATE DATABASE "oregontrail";
```

Then navigate to the root directory and run the following sequelize commands:

```
sequelize db:migrate
sequelize db:seed:all
```

### Launch Application
---

Run the following command from the root directory:

```
nodemon app.js
```

### Reformat and Reseed Database
---

 If you already have a local oregontrail database then login to postgres using the cli and run the following commands:

```
\c oregontrail
DROP TABLE "PartyMembers", "Supplies", "Games" CASCADE; DELETE FROM "SequelizeMeta";
```

Then quit postgres (\q) and run the two sequelize commands in the root directory:

```
sequelize db:migrate
sequelize db:seed:all
```
