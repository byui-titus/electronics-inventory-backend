const { ObjectId } = require('mongodb');
const mongodb = require('../config/database'); // Imports your database file

// 1. Add Product (POST /api/products)
const createProduct = async (req, res) => {
    const product = {
      productName: req.body.productName,
      category: req.body.category,
      brand: req.body.brand,
      quantity: Number(req.body.quantity) || 0,
      buyingPrice: Number(req.body.buyingPrice) || 0,
      sellingPrice: Number(req.body.sellingPrice) || 0,
      createdAt: new Date()
    };
    const response=await mongodb.getDatabase().db().collection('products').insertOne(product);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'some error occured while creating product.');
    }
  };
// 2. View All Products (GET /api/products)
const getAllProducts = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('products').find();
  result.toArray().then((products) =>{
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  });
}
// 3. Search Products (GET /api/products/search?q=charger)
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const searchRegex = {
      $regex: q,
      $options: 'i'
    };

    const query = {
      $or: [
        { productName: searchRegex },
        { brand: searchRegex },
        { category: searchRegex }
      ]
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('products')
      .find(query)
      .toArray();

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 4. Update Product (PUT /api/products/:id)
const updateProduct = async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const product ={
      productName: req.body.productName,
      category: req.body.category,
      brand: req.body.brand,
      quantity: Number(req.body.quantity) || 0,
      buyingPrice: Number(req.body.buyingPrice) || 0,
      sellingPrice: Number(req.body.sellingPrice) || 0,
      createdAt: new Date()
  };
  const response = await mongodb.getDatabase().db().collection('products').replaceOne({_id: productId}, product);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'some error occured while inserting product.');
  }
};

// 5. Delete Product (DELETE /api/products/:id)
const deleteProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('products')
      .deleteOne({ _id: productId });

    if (response.deletedCount > 0) {
      return res.status(200).json({
        message: 'Product deleted successfully'
      });
    }

    return res.status(404).json({
      message: 'Product not found'
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
 deleteProduct,
 updateProduct,
 searchProducts,
 createProduct,
 getAllProducts
};
