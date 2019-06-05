const mysql = require('mysql')
const { promisify } = require('util')                       // Una utilidad de node para poder usar async-await
const { database } = require('./keys')

const pool = mysql.createPool(database)                     // Crea un pool de conexciones

pool.getConnection((err, connection) => {                       // Obtiene una conexión del  pool de conexciones
    if (err) {                                                  // comprueba los tres errores más habituales
        if (err.code === 'PROTOCOL_CONECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED')
        }
    }
    if (connection) connection.release()                    // Si se crea una conexión, la deja de nuevo en el pool para que pueda ser utilizada
    console.log('DB is Connected')
    return
});

//promisify pool querys
pool.query = promisify(pool.query)       //indico a pool.query que puede usar async-await

module.exports = pool