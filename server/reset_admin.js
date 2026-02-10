const { db } = require('./database');
const bcrypt = require('bcryptjs');

const hashedPassword = bcrypt.hashSync('admin1234', 10);

db.run(
    `UPDATE users SET password = ? WHERE username = 'admin'`,
    [hashedPassword],
    function (err) {
        if (err) {
            console.error('Error updating admin password:', err);
        } else {
            console.log('Admin password reset successfully to: admin1234');
            if (this.changes === 0) {
                console.log('Admin user not found, creating it...');
                db.run(
                    `INSERT INTO users (username, password, email, phone, role) VALUES (?, ?, ?, ?, ?)`,
                    ['admin', hashedPassword, 'admin@example.com', '0000000000', 'admin'],
                    (err) => {
                        if (err) console.error(err);
                        else console.log('Admin user created.');
                    }
                );
            }
        }
    }
);
