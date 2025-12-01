/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "0won7w9f45sr1xm",
    "created": "2025-11-22 08:22:53.355Z",
    "updated": "2025-11-22 08:22:53.355Z",
    "name": "events_progress",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jmfoajf8",
        "name": "event_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "d2l9wf7i2c8cw3u",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "bgkl6p6m",
        "name": "event_name",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "aww6su51",
        "name": "event_icon",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "dwvzfjqc",
        "name": "event_note",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "emmz4ihw",
        "name": "event_start_date",
        "type": "date",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "adxcfhwi",
        "name": "event_end_date",
        "type": "date",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "c0wgv6f4",
        "name": "user_owner",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "ugm9jvok",
        "name": "wallet",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ahksbjygrpxeayw",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fc01qnul",
        "name": "currency",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "o9irgxs5oy34pvz",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "ikppe5lp",
        "name": "expenses",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "xc0cenkm",
        "name": "income",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && @request.auth.id = user_owner",
    "viewRule": "@request.auth.id != \"\" && @request.auth.id = user_owner",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT\n  (event.id || (CASE WHEN t.wallet IS NOT NULL THEN t.wallet ELSE '' END)) AS `id`,\n  event.id AS `event_id`,\n  event.name AS `event_name`,\n  event.icon AS `event_icon`,\n  event.note AS `event_note`,\n  event.start_date AS `event_start_date`,\n  event.end_date AS `event_end_date`,\n  event.user_owner AS `user_owner`,\n  t.wallet AS `wallet`,\n  w.currency AS `currency`,\n  SUM(CASE WHEN t.direction = 0 THEN  t.money ELSE 0 END) AS `expenses`,\n  SUM(CASE WHEN t.direction = 1 THEN  t.money ELSE 0 END) AS `income`\nFROM\n  events event\nLEFT JOIN transactions t ON t.event = event.id AND t.deleted=0\nLEFT JOIN wallets w ON w.id = t.wallet\nGROUP BY event.id, t.wallet"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("0won7w9f45sr1xm");

  return dao.deleteCollection(collection);
})
