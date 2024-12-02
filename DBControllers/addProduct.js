const { mysqlConnection } = require("../config/db");


//adding product
const addProducts = (req, res) => {
  // products table
  let product_name = req.body.product_name;
  let product_url = req.body.product_url;
  // product_description table
  let product_brief_description = req.body.product_brief_description;
  let product_description = req.body.product_description;
  let product_img = req.body.product_img;
  let product_link = req.body.product_link;
  // ProductPrice table
  let starting_price = req.body.starting_price;
  let price_range = req.body.price_range;
  //user table
  const user_name = req.body.User_name;
  const user_password = req.body.User_password;
  //insert product
  let insertProduct = `INSERT INTO products (product_url,product_name) VALUES ("${product_url}", "${product_name}") ;`;

  // insert  User
  let insertUser = `INSERT INTO Users (user_name, user_password) VALUES ("${user_name}", "${user_password}")`;
  //query
  mysqlConnection.query(insertProduct, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
  });
  mysqlConnection.query(insertUser, (err, result) => {
    if (err) {
      console.log(err);
      res.end(err);
    }

    //get product id and  user_id
    const selectPID = `SELECT product_id FROM products WHERE product_name = "${product_name}"`;
    const selectUID = `SELECT user_id FROM Users WHERE user_name = "${user_name}"`;
    //insert product desc,  price and order using product_id and user_id as a FOREIGN KEY
    mysqlConnection.query(selectPID, (err, result) => {
      let message = "data added successfully!";
      const PId = result[0].product_id;
      if (err) {
        console.log(err);
        res.end(err);
      } else {
        let insert_product_des = `INSERT INTO ProductDescription(product_id,product_brief_description,product_description,product_img,product_link) VALUES (${PId},"${product_brief_description}","${product_description}","${product_img}","${product_link}")`;

        let insert_Product_price = `INSERT INTO ProductPrice(product_id,starting_price,price_range) VALUES ("${PId}","${starting_price}", "${price_range}") ;`;

        //query
        mysqlConnection.query(insert_product_des, (err) => {
          if (err) {
            console.log(err);
            res.end(err);
          }
        });

        mysqlConnection.query(insert_Product_price, (err) => {
          if (err) {
            console.log(err);
            res.end(err);
          }
        });

        mysqlConnection.query(selectUID, (err, result) => {
          const UId = result[0].user_id;
          if (err) {
            console.log(err);
            res.end(err);
          } else {
            let insertOrder = `INSERT INTO ProductOrder (product_id, user_id) VALUES ("${PId}", "${UId}");`;
            //query
            mysqlConnection.query(insertOrder, (err) => {
              if (err) {
                console.log(err);
                res.end(err);
              }
            });
          }
        });
      }
      console.log(message);
      res.send(message);
    });
  });
};

module.exports = { addProducts };
