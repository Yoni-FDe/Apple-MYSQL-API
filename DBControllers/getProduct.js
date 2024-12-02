const { mysqlConnection } = require("../config/db");

const getProducts = (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM Products INNER JOIN ProductDescription INNER JOIN ProductPrice ON Products.product_id = ProductDescription.product_id AND Products.product_id = ProductPrice.product_id",
    (err, rows) => {
      if (!err) res.json({ status: "OK", products: rows });
      else console.log(err);
    }
  );
};

module.exports = { getProducts };
