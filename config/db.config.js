module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Newuser#123",
    DB: "Login",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };