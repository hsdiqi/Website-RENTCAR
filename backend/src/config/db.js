const oracledb = require('oracledb');
// const { db } = require('../env');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
oracledb.initOracleClient({ libDir: "C:\\ProgramData\\Oracle\\instantclient_19_23" });

const dbConfig = {
    user: 'rentcar',
    password: 'bee123',
    connectString: 'localhost/xe',
    externalAuth: false
}

async function initialize() {
    try {
        await oracledb.createPool(dbConfig)
        console.log('Database connection pool created successfully');
    } catch (error) {
        console.error('Error creating database connection pool:', error);
        // throw error;
    }
}

initialize();
module.exports = oracledb;