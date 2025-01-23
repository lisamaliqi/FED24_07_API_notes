# Prisma demo app

Steps for creating a brand new Node-app that uses Prisma.

## Create `package.json`

```bash
npm init -y
```

## Install typescript, ts-node and type-definitions for Node.js

```bash
npm install typescript ts-node @types/node --save-dev
```

## Create TypeScript config file

```bash
npx tsc --init
```

## Install Prisma CLI

```bash
npm install prisma --save-dev
```

## Initialize Prisma

Will generate `prisma/schema.prisma` as well as a `.env`-file with a variable
for the database URL.

```bash
npx prisma init --datasource-provider mysql
```

## Edit `.env` and change the database URL

**N.B.!** You might have to change the port from 8889 to 3306, depending on
your environment.

```env
DATABASE_URL="mysql://root:root@localhost:8889/fed24_phones"
```

## Create the database `fed24_phones`

If you haven't already done so, browse to phpMyAdmin and create a new database
named `fed24_phones`.

## Import `fed24_phones.sql

Then click on "Import" and browse to the `fed24_phones.sql` in this repo and
then click on "Import" at the bottom of the page.
