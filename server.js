"use strict";
const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());  // This will allow you to parse JSON data in the request body

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'pace',
    password: '123456',
    database: 'test'
});

// Connect to the MySQL database
connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

// Set the port for the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Simple Hello World endpoint
app.get('/hello', function (req, res) {
    res.set("Content-Type", "text/plain");
    res.send('Hello World!');
});

// Echo endpoint to return the input query
app.get('/echo', function (req, res) {
    const value = req.query['input'];
    res.set("Content-Type", "text/plain");
    res.send(value);
});

// GET endpoint to fetch a phone by No (primary key)
app.get('/phone/:no', function (req, res) {
    const phoneNo = req.params['no'];

    // Query to get phone data by No
    let query = 'SELECT * FROM best_selling_mobile_phones WHERE No = ?';
    connection.query(query, [phoneNo], function (error, results) {
        if (error) {
            res.status(500).send('Internal Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Phone Not Found');
        } else {
            res.json(results[0]);  // Send the first result as JSON
        }
    });
});

// POST endpoint to update a phone's details by No
app.post('/phone/:no', function (req, res) {
    const phoneNo = req.params['no'];
    const { Phone, Company, Sold } = req.body;  // Assuming these are sent in the body of the request

    // Update the phone's details by its No
    let query = 'UPDATE best_selling_mobile_phones SET Phone = ?, Company = ?, Sold = ? WHERE No = ?';
    connection.query(query, [Phone, Company, Sold, phoneNo], function (error, results) {
        if (error) {
            res.status(500).send('Internal Error');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Phone Not Found');
        } else {
            res.send('Phone updated successfully');
        }
    });
});

// DELETE endpoint to delete a phone by No
app.delete('/phone/:no', function (req, res) {
    const phoneNo = req.params['no'];

    // Delete the phone by its No
    let query = 'DELETE FROM best_selling_mobile_phones WHERE No = ?';
    connection.query(query, [phoneNo], function (error, results) {
        if (error) {
            res.status(500).send('Internal Error');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Phone Not Found');
        } else {
            res.send('Phone deleted successfully');
        }
    });
});

// GET endpoint to fetch all phones
app.get('/phones', function (req, res) {
    // Query to get all phone records
    let query = 'SELECT * FROM best_selling_mobile_phones';
    connection.query(query, function (error, results) {
        if (error) {
            res.status(500).send('Internal Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('No phones found');
        } else {
            res.json(results);  // Send all results as JSON
        }
    });
});
// POST endpoint to add a new phone
app.post('/phones', function (req, res) {
    const { Phone, Company, Sold } = req.body;  // Assuming these are sent in the body of the request

    // Query to insert a new phone record
    let query = 'INSERT INTO best_selling_mobile_phones (Phone, Company, Sold) VALUES (?, ?, ?)';
    connection.query(query, [Phone, Company, Sold], function (error, results) {
        if (error) {
            res.status(500).send('Internal Error');
            return;
        }

        res.status(201).send('Phone added successfully');
    });
});
