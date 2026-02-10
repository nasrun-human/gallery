const { db } = require('./database');

db.all("SELECT id, username, password, role FROM users", (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Users in DB:', rows);
    }
});
