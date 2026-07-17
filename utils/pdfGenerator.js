const PDFDocument = require('pdfkit');

const generateSalesPDF = (sales, filter, res) => {

    const doc = new PDFDocument({
        margin: 40,
        size: 'A4'
    });

    res.setHeader(
        'Content-Type',
        'application/pdf'
    );

    res.setHeader(
        'Content-Disposition',
        `attachment; filename=Sales_Report_${filter}.pdf`
    );

    doc.pipe(res);

    //------------------------------------------------
    // Title
    //------------------------------------------------

    doc
        .fontSize(22)
        .text(
            'TOPAZ MOVIES, PHONE ACCESSORIES & SOFTWARE',
            {
                align: 'center'
            }
        );

    doc.moveDown();

    doc
        .fontSize(18)
        .text(
            'Sales Report',
            {
                align: 'center'
            }
        );

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Report: ${filter}`);

    doc.text(
        `Generated: ${new Date().toLocaleString()}`
    );

    doc.moveDown();

    //------------------------------------------------
    // Table Header
    //------------------------------------------------

    doc.text(
        '------------------------------------------------------------'
    );

    doc.text(
        'Customer     Product      Qty     Revenue     Profit'
    );

    doc.text(
        '------------------------------------------------------------'
    );

    let totalRevenue = 0;

    let totalProfit = 0;

    //------------------------------------------------
    // Sales
    //------------------------------------------------

    sales.forEach(sale => {

        totalRevenue += sale.revenue;

        totalProfit += sale.profit;

        doc.text(
            `${sale.customerName || 'Walk-in'}    ${sale.productName}    ${sale.quantitySold}    ${sale.revenue}    ${sale.profit}`
        );

    });

    doc.moveDown();

    doc.text(
        '------------------------------------------------------------'
    );

    doc.fontSize(14);

    doc.text(
        `Total Revenue : UGX ${totalRevenue.toLocaleString()}`
    );

    doc.text(
        `Total Profit : UGX ${totalProfit.toLocaleString()}`
    );

    doc.end();

};

module.exports = generateSalesPDF;