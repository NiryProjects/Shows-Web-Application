# MongoDB Local Development Guide 🍃

This guide explains how to set up, run, and interact with a local MongoDB instance for the Shows Web Application.

---

## 🚀 1. How to Run MongoDB

On macOS, the easiest way to manage MongoDB is via **Homebrew**.

### Start MongoDB

To run MongoDB as a background service (recommended):

```bash
brew services start mongodb-community@7.0
```

### Run Manually

If you want to run it in your current terminal session:

```bash
mongod --config /usr/local/etc/mongod.conf
```

_(Note: The terminal must stay open for MongoDB to keep running.)_

---

## 🛑 2. How to Stop MongoDB

### Stop background service:

```bash
brew services stop mongodb-community@7.0
```

### Stop manual instance:

Press `Ctrl + C` in the terminal window where `mongod` is running.

---

## 🔍 3. How to Query Data (CRUD)

Use the MongoDB Shell (**mongosh**) to interact with your data.

### Open Shell:

```bash
mongosh
```

### Select Database:

```bash
use shows-app
```

### 📝 CRUD Cheatsheet

| Operation  | Command Example                                                            |
| :--------- | :------------------------------------------------------------------------- |
| **Create** | `db.users.insertOne({ username: "testuser", email: "test@test.com" })`     |
| **Read**   | `db.users.find({ username: "testuser" })`                                  |
| **Update** | `db.users.updateOne({ username: "testuser" }, { $set: { active: true } })` |
| **Delete** | `db.users.deleteOne({ username: "testuser" })`                             |

---

## 🛠️ 4. Useful Tools

- **MongoDB Compass**: A GUI for MongoDB. Highly recommended for visual querying.
- **mongosh**: The modern command-line shell (installed via `brew install mongodb-community-shell`).

## 💡 Quick Tips

- The default connection string for local dev is: `mongodb://localhost:27017/shows-app` (already set in your `.env`).
- If you get a connection error, verify that the `mongod` service is started.
