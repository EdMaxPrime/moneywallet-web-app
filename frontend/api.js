/************************************
This file contains the Pocketbase API. By importing this file, you have access
to the instance used to communicate with the server.
*************************************/

const PocketBase = require("pocketbase/cjs");

const pb = new PocketBase("http://127.0.0.1:8090");

module.exports = pb;