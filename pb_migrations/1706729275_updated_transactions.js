/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  collection.indexes = [
    "CREATE INDEX `idx_nIPoPaO` ON `transactions` (`wallet`)",
    "CREATE INDEX `idx_kBzy56R` ON `transactions` (`date`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  collection.indexes = []

  return dao.saveCollection(collection)
})
