const queryAsync = require('../utils/db');

exports.tes = (req, res) => {
    queryAsync('SELECT * FROM karyawan')
    .then((result) => {
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No DataFound'})
        }

        res.status(200).json(result)
    })
    .catch((error) => {
        console.error('Error executing query:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    });
}
