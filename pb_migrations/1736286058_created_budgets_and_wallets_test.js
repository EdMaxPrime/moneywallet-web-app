/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "tqyed6jgqpzk3oq",
    "created": "2025-01-07 21:40:58.606Z",
    "updated": "2025-01-07 21:40:58.606Z",
    "name": "budgets_progress",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nm1uvctz",
        "name": "budget_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "rkod9uccj5k0s82",
          "cascadeDelete": false,
          "minSelect": false,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "hhxlll9x",
        "name": "type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "0",
            "1",
            "2"
          ]
        }
      },
      {
        "system": false,
        "id": "aqzdcyql",
        "name": "category",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "89wt72q3zvru4bt",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "hm8bq6j7",
        "name": "category_name",
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
        "id": "ioubknc4",
        "name": "category_icon",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "mw4jyvqa",
        "name": "category_type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "0",
            "1",
            "2"
          ]
        }
      },
      {
        "system": false,
        "id": "h1o88chd",
        "name": "category_show_in_report",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "riyy6zqu",
        "name": "start_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "otnuxrdr",
        "name": "end_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "ken7unym",
        "name": "money",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "0lybnbue",
        "name": "currency",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "o9irgxs5oy34pvz",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "hi0rm1x5",
        "name": "tag",
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
        "id": "bg8h0xpw",
        "name": "wallets",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ahksbjygrpxeayw",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "sjyri0lb",
        "name": "user_owner",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "4qiur3ac",
        "name": "progress",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "1xpegztb",
        "name": "has_wallet_in_total",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && @request.auth.id = user_owner",
    "viewRule": "@request.auth.id != \"\" && @request.auth.id = user_owner",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT\n(ROW_NUMBER() OVER ()) AS `id`,\nb.id AS `budget_id`,\nb.type AS `type`, \nb.category AS `category`, \nc.name AS `category_name`, \nc.icon AS `category_icon`, \nc.type AS `category_type`, \nc.show_in_report AS `category_show_in_report`, \nb.start_date AS `start_date`, \nb.end_date AS `end_date`, \nb.money AS `money`, \nb.currency AS `currency`, \nb.tag AS `tag`, \nb.wallets AS `wallets`,\nb.user_owner AS `user_owner`,\nSUM(_progress) AS `progress`,\nMAX(_wallet_total) AS `has_wallet_in_total`\nFROM (\n\n    -- query all budgets of type expenses\n    -- one row for each budget-wallet combination, plus sum of money\n    SELECT \n        b.id AS `id`,\n        b.user_owner AS `user_owner`,\n        b.type AS `type`,\n        b.category AS `category`,\n        b.start_date AS `start_date`,\n        b.end_date AS `end_date`,\n        b.money AS `money`,\n        b.currency AS `currency`,\n        b.tag AS `tag`,\n        b.wallets AS `wallets`,\n        b._wallet_id AS _wallet_id, \n        b._wallet_currency AS _wallet_currency, \n        b._wallet_total AS _wallet_total, \n        SUM(t.money) AS _progress \n    FROM (\n        -- join budgets to their wallets so we can filter transactions by wallet\n        SELECT \n            b1.id AS `id`,\n            b1.user_owner AS `user_owner`,\n            b1.type AS `type`,\n            b1.category AS `category`,\n            b1.start_date AS `start_date`,\n            b1.end_date AS `end_date`,\n            b1.money AS `money`,\n            b1.currency AS `currency`,\n            b1.tag AS `tag`,\n            b1.wallets AS `wallets`,\n            w.id AS _wallet_id, \n            w.currency AS _wallet_currency, \n            w.count_in_total AS _wallet_total \n        FROM budgets AS b1, JSON_EACH(b1.wallets) AS bw\n        JOIN wallets AS w ON w.id = bw.value\n        WHERE b1.type = 0\n     ) AS b \n    -- filter transactions by wallet, budget date range, direction=expense, non-transfer\n    LEFT JOIN transactions AS t \n        ON b._wallet_id = t.wallet AND \n        t.direction = 0 AND \n        DATETIME(t.date) <= DATETIME('now', 'localtime') AND \n        DATE(t.date) >= DATE(b.start_date) AND \n        DATE(t.date) <=  DATE(b.end_date) \n        -- exclude transfers within the budget\n        AND t.type != 1\n    GROUP BY b.id, b._wallet_id \n\n    UNION\n\n    -- query all budgets of type income\n    -- one row for each budget-wallet combination, plus sum of money\n    SELECT \n        b.id AS `id`,\n        b.user_owner AS `user_owner`,\n        b.type AS `type`,\n        b.category AS `category`,\n        b.start_date AS `start_date`,\n        b.end_date AS `end_date`,\n        b.money AS `money`,\n        b.currency AS `currency`,\n        b.tag AS `tag`,\n        b.wallets AS `wallets`,\n        b._wallet_id AS _wallet_id, \n        b._wallet_currency AS _wallet_currency, \n        b._wallet_total AS _wallet_total, \n        SUM(t.money) AS _progress \n    FROM (\n        -- join budgets to their wallets so we can filter transactions by wallet\n        SELECT \n            b1.id AS `id`,\n            b1.user_owner AS `user_owner`,\n            b1.type AS `type`,\n            b1.category AS `category`,\n            b1.start_date AS `start_date`,\n            b1.end_date AS `end_date`,\n            b1.money AS `money`,\n            b1.currency AS `currency`,\n            b1.tag AS `tag`,\n            b1.wallets AS `wallets`, \n            w.id AS _wallet_id, \n            w.currency AS _wallet_currency, \n            w.count_in_total AS _wallet_total \n        FROM budgets AS b1, JSON_EACH(b1.wallets) AS bw\n        JOIN wallets AS w ON w.id = bw.value\n        WHERE b1.type = 1\n     ) AS b \n    -- filter transactions by wallet, budget date range, direction=income, non-transfer\n    LEFT JOIN transactions AS t \n        ON b._wallet_id = t.wallet AND \n        t.direction = 1 AND \n        DATETIME(t.date) <= DATETIME('now', 'localtime') AND \n        DATE(t.date) >= DATE(b.start_date) AND \n        DATE(t.date) <=  DATE(b.end_date) \n        -- exclude transfers within the budget\n        AND t.type != 1\n    GROUP BY b.id, b._wallet_id \n\n    UNION \n    -- query all budgets of type category\n    -- one row for each budget-wallet combination, plus sum of money\n    SELECT \n        b.id AS `id`,\n        b.user_owner AS `user_owner`,\n        b.type AS `type`,\n        b.category AS `category`,\n        b.start_date AS `start_date`,\n        b.end_date AS `end_date`,\n        b.money AS `money`,\n        b.currency AS `currency`,\n        b.tag AS `tag`,\n        b.wallets AS `wallets`,\n        b._wallet_id AS _wallet_id, \n        b._wallet_currency AS _wallet_currency, \n        b._wallet_total AS _wallet_total,  \n        SUM(((t.direction * 2) - 1) * t.money) AS _progress \n    FROM (\n        -- join budgets to their wallets so we can filter transactions by wallet\n        SELECT \n            b1.id AS `id`,\n            b1.user_owner AS `user_owner`,\n            b1.type AS `type`,\n            b1.category AS `category`,\n            b1.start_date AS `start_date`,\n            b1.end_date AS `end_date`,\n            b1.money AS `money`,\n            b1.currency AS `currency`,\n            b1.tag AS `tag`,\n            b1.wallets AS `wallets`, \n            w.id AS _wallet_id, \n            w.currency AS _wallet_currency, \n            w.count_in_total AS _wallet_total \n        FROM budgets AS b1, JSON_EACH(b1.wallets) AS bw\n        JOIN wallets AS w ON w.id = bw.value\n        WHERE b1.type = 2\n    ) AS b \n    -- select transactions and their parent category\n    LEFT JOIN (\n        SELECT \n            tr.direction AS `direction`,\n            tr.money AS `money`,\n            tr.category AS `category`,\n            tr.date AS `date`,\n            tr.wallet AS `wallet`, \n            tc.parent AS _parent_category \n        FROM transactions AS tr \n        JOIN categories AS tc ON tr.category = tc.id \n    ) AS t ON (\n    -- filter transactions by wallet, budget date range, matching category or if the transaction's parent category matches\n        b._wallet_id = t.wallet AND \n        DATETIME(t.date) <= DATETIME('now', 'localtime') AND \n        DATE(t.date) >= DATE(b.start_date) AND \n        DATE(t.date) <=  DATE(b.end_date) AND \n        (b.category = t.category OR \n            b.category = t._parent_category)\n    ) \n    GROUP BY b.id, b._wallet_id\n) AS b\n\n-- add category to budget-wallet combinations\nLEFT JOIN categories AS c \n    ON b.category = c.id  \n-- consolidate budget(1)-category(1)-wallet(many) rows into just budget(1)-category(1)-array of wallets\nGROUP BY b.id"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tqyed6jgqpzk3oq");

  return dao.deleteCollection(collection);
})
