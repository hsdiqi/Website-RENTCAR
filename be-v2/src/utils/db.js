const OracleDB = require("../config/db");
const dbConfig = require("../config/db");

async function queryAsync(sql, params = []) {
  let connection;

  try {
    connection = await dbConfig.getConnection();
    const result = await connection.execute(
      sql,
      params,
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    return result.rows; 
  } catch (error) {
    console.error("db error:", error);
    throw error; 
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }
  }
}


module.exports = queryAsync;
