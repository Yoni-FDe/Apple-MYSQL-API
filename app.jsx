// const express = require("express");
// var cors = require("cors");
// const body_parser = require("body-parser");

// const { connectDB } = require("./config/db");
// const { getProducts } = require("./DBControllers/getProduct");
// const { createTables } = require("./DBControllers/createTable");
// const { addProducts } = require("./DBControllers/getProduct");

// const app = express();
// // Middle ware to have access to the frontend
// //cors for global
// // app.use(cors());
// //use this cors option for partners (if not global)


// const corsOption = {
//   origin: [
//     "http://localhost:3003/add-Product",
//     "http://localhost:3003",
//     "https://www.evangadi.com",
//     "https://www.apple.com",
//   ],
// };
// app.use(cors(corsOption));

// //middleware to captures all the information entered in an HTML form and parses them in an object form.
// app.use(body_parser.urlencoded({ extended: true }));

// //database connection
// connectDB;

// //*Routes
// app.get("/", (req, res) => {
//   res.send("Connection is up on running");
// });
// //  Create  tables route
// app.get("/tables", createTables);
// // Insert a new iPhone route
// app.post("/add-product", addProducts);
// //Get all products route
// app.get("/get-product", getProducts);

// const port = 3003;
// app.listen(port, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(`server is  running on http://localhost:${port}`);
//   }
// });



/*
?Question 1: Create a MySQL database by the name "myDB" and create a database user by the name "myDBuser" with a permissions to connect with the "myDB" database. Use the "mysql" module to create a connection with the newly created database. Display console message if the connection is successful or if it has an error.

*/

const express = require('express');
const mysql2 = require('mysql2');
require("dotenv").config();
const cors = require('cors');
const app=express();

// Middle ware to extract info from the html
app.use(
  express.urlencoded({
    extended: true,
  })
);
// Middle ware to have access to the frontend
app.use(cors());
app.use(express.json());

// User account info
const mysqlConnection = mysql2.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    });

// Connect to MySQL
mysqlConnection.connect((err)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Connected to MYSQl!");
    }
});

// Route: /install => To create the tables
app.get("/install",(req,res)=>{
    
    const ProductsTable = `CREATE TABLE if not exists Products(

        product_id INT AUTO_INCREMENT,
        product_url VARCHAR(191) NOT NULL UNIQUE,
        product_name VARCHAR(191) NOT NULL UNIQUE,

        PRIMARY KEY (product_id)
        
    )`;
        
    let createProductDescription = `CREATE TABLE if not exists ProductDescription(
        description_id int auto_increment,
        product_id int(11) not null,
        product_brief_description varchar(255) not null,
        product_description varchar(255) not null,
        product_img varchar(255) not null,
        product_link varchar(255) not null,

        PRIMARY KEY (description_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
        )`;
        
    let createProductPrice = `CREATE TABLE if not exists ProductPrice(
        price_id int auto_increment,
        product_id int(11) not null,    
        starting_price varchar(255) not null,
        price_range varchar(255) not null,

        PRIMARY KEY (price_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
        )`;
    
        let userTable = `CREATE TABLE if not exists UsersTable(

        user_id INT AUTO_INCREMENT,
        User_name VARCHAR(255) NOT NULL,
        User_password VARCHAR(255) NOT NULL,

        PRIMARY KEY (user_id)
        
    )`;
    
        let ordersTable = `CREATE TABLE if not exists ProductOrder(

        order_id INT AUTO_INCREMENT,
        product_id INT NOT NULL,
        user_id INT NOT NULL,

        PRIMARY KEY (order_id),
        FOREIGN KEY (product_id ) REFERENCES Products(product_id),
        FOREIGN KEY (user_id) REFERENCES  UsersTable(user_id) 
        
    )`;

   // Executing the query's we wrote above

        mysqlConnection.query(ProductsTable, (err, results, fields) => {
            if (err) {
            console.log(err);
            }
        });
        mysqlConnection.query(createProductDescription, (err, results, fields) => {
        if (err) {
            console.log(err);
        }
        });

        mysqlConnection.query(createProductPrice, (err, results, fields) => {
            if (err) {
            console.log(err);
            }
        });
        mysqlConnection.query(userTable, (err, results, fields) => {
        if (err) {
            console.log(err);
        }
        });
        mysqlConnection.query(ordersTable,(err,results,fields)=>{
            if(err)
            {
                console.log(err);
            }
        });

    res.end("Tables created");

})

// Route: /addiphones => To insert data to the tables

app.post("/addiphones",(req,res)=>{

    // Extracting the values sent from the frontend

        //Product table
        const productUrl = req.body.product_url;
        const productName = req.body.product_name;

        ///Product description table
        const briefDescription = req.body.product_brief_description;
        const fullDescription = req.body.product_description;
        const productImg = req.body.product_img;
        console.log(productImg);
        const productLink = req.body.product_link;

        ///Product price table
        const startingPrice = req.body.starting_price;
        const priceRange = req.body.price_range;

        ///user table
        const userName = req.body.User_name;
        const userPassword = req.body.User_password;

        // Check if the product already exists in the Products table
        let checkProduct = `SELECT * FROM Products WHERE product_url = (?) OR product_name = (?)`;
        mysqlConnection.query(checkProduct,[productUrl, productName],(err, result) => {
            if (err) {
                console.log(err);
                return res.end("Error checking for existing product");
            }

            if (result.length > 0) {
              // If a product with the same URL or name exists, don't insert it again
                return res.end("Product already exists");
            }
            // If no duplicate is found, insert the new product
            //To insert the above values we use the following syntax
            let insertProduct = `INSERT INTO Products (product_url,product_name) VALUES (?, ?) `;
            mysqlConnection.query(insertProduct,[productUrl,productName], (err, result) => {
            if (err) {
                console.log(err);
                return res.end("Error inserting product");
            }

              const productId = result.insertId; // Get the auto-incremented product_id
                console.log(result);
              // Insert product description
            let insertDescription = `INSERT INTO ProductDescription (product_id, product_brief_description, product_description, product_img, product_link) VALUES (?,?,?,?,?)`;

            mysqlConnection.query(insertDescription,[productId,briefDescription,fullDescription,productImg,productLink], (err) => {
                if (err) {
                    console.log(err);
                    return res.end("Error inserting product description");
                }
            });

              // Insert product price
            let insertPrice = `INSERT INTO ProductPrice (product_id, starting_price, price_range) VALUES (?,?,?)`;

            mysqlConnection.query(insertPrice,[productId,startingPrice,priceRange], (err) => {
                if (err) {
                    console.log(err);
                    return res.end("Error inserting product price");
                }
            });

              // Insert into UsersTable and get user_id
            let insertUser = `INSERT INTO UsersTable (User_name, User_password) VALUES (?,?)`;
            mysqlConnection.query(insertUser,[userName,userPassword], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.end("Error inserting user");
                }

                const userId = result.insertId; // Get the auto-incremented user_id

                // Insert into ProductOrder table using both product_id and user_id
                let insertOrder = `INSERT INTO ProductOrder (product_id, user_id) VALUES ("${productId}", "${userId}")`;
                mysqlConnection.query(insertOrder,[productId,userId], (err) => {
                if (err) {
                    console.log(err);
                    return res.end("Error inserting order");
                }

                    res.end("Data inserted successfully!");
                });
            });
        });

            res.end("Data inserted successfully!");
        });
});
//to retrive data from database
app.get("/iphone", (req, res) => {
    const query = `SELECT * FROM Products JOIN ProductDescription JOIN ProductPrice ON Products.product_id = ProductDescription.product_id AND Products.product_id = ProductPrice.product_id 
        `;

        mysqlConnection.query(query, (err, results) => {
            if (err) {
            console.error("Error retrieving products:", err);
            res.status(500).send({ message: "Error retrieving products" });
            } else {
            res.status(200).json(results); // Send the retrieved data as JSON
            }
    });
});
//updating the values
// app.put("/update", (req, res) => {
//   const { product_name, product_id } = req.body;
//   let updateProduct = UPDATE Products SET product_name = ? WHERE product_id = ?;
//   connection.query(updateProduct,[product_name, product_id],
//     (err, results, fields) => {
//       if (err) throw err;
//       console.log(results.affectedRows + " record(s) updated");
//       res.send(results);
//     }
//   );
// });

app.listen(3004, (err) => {
    console.log("Server is running to accept request using 3004.");
});