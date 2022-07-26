const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('toughts', 'root', 'JEKIO4kk@s', {
  host: 'localhost',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('conectou')
} catch (err) {
  console.log(`nao conectou: ${err}`)
}

module.exports = sequelize
