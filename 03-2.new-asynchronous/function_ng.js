export { runAsync, allAsync, closeAsync };

const runAsync = (db, sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, ...params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const allAsync = (db, sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, ...params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => {
          console.log(`${row.id} ${row.title}`);
        });
        resolve();
      }
    });
  });
};

const closeAsync = (db) => {
  return new Promise((resolve, _) => {
    db.close();
    resolve();
  });
};
