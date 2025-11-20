/*
  MongoDB Index Creation Script
 
*/


db.users.createIndex({ email: 1 }, { unique: true });

db.watchlist.createIndex({ userId: 1, addedAt: -1 });
db.watchlist.createIndex({ userId: 1, id: 1 });
db.movies.createIndex({ userId: 1, addedAt: -1 });
first.
db.movies.createIndex({ userId: 1, title: 1 });
db.omdb_cache.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print("Indexes created successfully!");
