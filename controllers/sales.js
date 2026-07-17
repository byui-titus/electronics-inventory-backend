const { ObjectId } = require('mongodb');
const mongodb = require('../config/database');
const generateSalesPDF = require('../utils/pdfGenerator');


const sellProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const quantitySold = Number(req.body.quantitySold);
    const customerName = req.body.customerName;
    const sellingPrice = Number(req.body.sellingPrice);

    const db = mongodb.getDatabase().db();

    const product = await db
      .collection('products')
      .findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    if (product.quantity < quantitySold) {
      return res.status(400).json({
        message: 'Insufficient stock'
      });
    }

    const revenue =
      sellingPrice * quantitySold;

    const profit =
      (sellingPrice - product.buyingPrice) *
      quantitySold;

    await db.collection('products').updateOne(
      { _id: productId },
      {
        $inc: {
          quantity: -quantitySold
        }
      }
    );

    await db.collection('sales').insertOne({
      productId: product._id,
      productName: product.productName,
      customerName,
      quantitySold,
      unitCost: product.buyingPrice,
      unitPrice: sellingPrice,
      revenue,
      profit,
      saleDate: new Date()
    });

    res.status(200).json({
      message: 'Sale recorded successfully',
      revenue,
      profit,
      sale: {
              customerName,
              productName: product.productName,
              quantitySold,
              unitPrice: product.sellingPrice,
              revenue,
              saleDate: new Date()
            }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getTodaySales = async (req, res) => {
  try {
    const db = mongodb.getDatabase().db();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await db
  .collection('sales')
  .find({
    saleDate: {
      $gte: today,
      $lt: tomorrow
    }
  })
  .toArray();

    res.status(200).json(sales);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getProfitSummary = async (req, res) => {
  try {

    const db = mongodb.getDatabase().db();

    const result = await db
      .collection('sales')
      .aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: '$revenue'
            },
            totalProfit: {
              $sum: '$profit'
            },
            totalSales: {
              $sum: 1
            }
          }
        }
      ])
      .toArray();

    res.status(200).json(result[0]);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
const getDashboard = async (req, res) => {
  try {

    const db = mongodb.getDatabase().db();

    const totalProducts =
      await db.collection('products')
      .countDocuments();

    const lowStock =
      await db.collection('products')
      .countDocuments({
        quantity: {
          $lte: 10
        }
      });

    const salesData =
      await db.collection('sales')
      .aggregate([
        {
          $group: {
            _id: null,
            revenue: {
              $sum: '$revenue'
            },
            profit: {
              $sum: '$profit'
            }
          }
        }
      ])
      .toArray();

    res.status(200).json({
      totalProducts,
      lowStockProducts: lowStock,
      totalRevenue:
        salesData[0]?.revenue || 0,
      totalProfit:
        salesData[0]?.profit || 0
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getAllSales = async (req, res) => {
  try {
    const db = mongodb.getDatabase().db();

    const sales = await db
      .collection('sales')
      .find()
      .sort({ saleDate: -1 })
      .toArray();

    res.status(200).json(sales);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateSalesReport = async (req, res) => {

    try {

        const db = mongodb.getDatabase().db();

        const filter = req.params.filter;

        let startDate = null;

        const today = new Date();

        switch (filter) {

            case 'today':

                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);

                break;

            case 'week':

                startDate = new Date();
                startDate.setDate(today.getDate() - 7);

                break;

            case 'month':

                startDate = new Date();
                startDate.setMonth(today.getMonth() - 1);

                break;

            case 'all':

                startDate = null;

                break;

            default:

                return res.status(400).json({
                    message: 'Invalid filter'
                });

        }

        let query = {};

        if (startDate) {

            query.saleDate = {
                $gte: startDate
            };

        }

        const sales = await db
            .collection('sales')
            .find(query)
            .sort({
                saleDate: -1
            })
            .toArray();

        generateSalesPDF(
            sales,
            filter,
            res
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

module.exports = {
  sellProduct,
  getTodaySales,
  getProfitSummary, 
  getDashboard,
  getAllSales,
  generateSalesReport
};