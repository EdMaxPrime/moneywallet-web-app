/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  collection.createRule = "@request.auth.id != \"\" && (place = \"\" || place = null || place.user_owner = @request.auth.id) && (event = \"\" || event = null || event.user_owner = @request.auth.id) && (people = null || people.user_owner:each = @request.auth.id)"
  collection.updateRule = "wallet.user_owner.id = @request.auth.id && (place = \"\" || place = null || place.user_owner = @request.auth.id) && (event = \"\" || event = null || event.user_owner = @request.auth.id) && (people = null || people.user_owner:each = @request.auth.id)"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "adi6rwcc",
    "name": "place",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "k11bp64qiz2e0qe",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0iirujoj",
    "name": "event",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4u1bnp9t",
    "name": "people",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "6xfurng04v6d7n4",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z1bunuae",
    "name": "description",
    "type": "text",
    "required": false,
    "presentable": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "wallet.user_owner.id = @request.auth.id"

  // remove
  collection.schema.removeField("adi6rwcc")

  // remove
  collection.schema.removeField("0iirujoj")

  // remove
  collection.schema.removeField("4u1bnp9t")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z1bunuae",
    "name": "description",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
