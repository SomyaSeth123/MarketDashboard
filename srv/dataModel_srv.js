const MarketDashboardServices = {};

const hana = require('@sap/hana-client');

// HANA database connection settings
const connOptions = {
    serverNode: 'fdd1fcaa-7efa-4a37-a054-580b428943cf.hana.trial-us10.hanacloud.ondemand.com:443',
    UID: 'DBADMIN',
    PWD: 'Sethsomya@12345'
};

// Create a HANA client connection
const conn = hana.createConnection();

// Connect to the HANA database
conn.connect(connOptions, (err) => {
    if (err) {
        console.error('Error connecting to HANA:', err);
        return;
    }
    console.log('Connected to HANA');
});

const executeQuery = async (sql, params) => {
    try {
        const result = await conn.exec(sql, params);
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // Throw error for handling in caller function
    }
};

// Create entity
MarketDashboardServices.createEntity = async (data, type) => {
    // if(type == 'sales'){
    //     const sql = 'INSERT INTO MyTable (column1, column2, ...) VALUES (?, ?, ...)';
    //     const params = [data.column1, data.column2, ...];
    //     return await executeQuery(sql, params);
    // }
    // else{
    //     const sql = 'INSERT INTO MyTable (column1, column2, ...) VALUES (?, ?, ...)';
    //     const params = [data.column1, data.column2, ...];
    //     return await executeQuery(sql, params);
    // }
};

// Read entity
MarketDashboardServices.readEntity = async (id, type) => {
    // if(type == 'sales'){
    //     const sql = 'SELECT * FROM MyTable WHERE id = ?';
    //     const params = [id];
    //     return await executeQuery(sql, params);
    // }
    // else{
    //     const sql = 'SELECT * FROM MyTable WHERE id = ?';
    //     const params = [id];
    //     return await executeQuery(sql, params);
    // }
};

// Update entity
// const updateEntity = async (id, data, type) => {
//     const sql = 'UPDATE MyTable SET column1 = ?, column2 = ? WHERE id = ?';
//     const params = [data.column1, data.column2, id]; // Replace column names with actual column names
//     return await executeQuery(sql, params);
// };

// // Delete entity
// const deleteEntity = async (id, type) => {
//     const sql = 'DELETE FROM MyTable WHERE id = ?';
//     const params = [id];
//     return await executeQuery(sql, params);
// };

module.exports = MarketDashboardServices
