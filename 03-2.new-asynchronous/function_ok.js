export { runAsync, allAsync, closeAsync };

const runAsync = (db, sql, ...params) => {
  return new Promise((resolve, _) => {
    db.run(sql, ...params, function () {
      resolve(this.lastID);
    });
  });
};

const allAsync = (db, sql, ...params) => {
  return new Promise((resolve, _) => {
    db.all(sql, ...params, (_, rows) => {
      resolve(rows);
    });
  });
};

const closeAsync = (db) => {
  return new Promise((resolve, _) => {
    db.close();
    resolve();
  });
};
