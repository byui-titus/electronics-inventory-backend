const PDFDocument = require('pdfkit-table');

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

  //------------------------------------------------
// TABLE
//------------------------------------------------

let totalRevenue = 0;
let totalProfit = 0;

const startX = 40;
let y = 170;

const columns = {
    customer: 40,
    product: 150,
    qty: 290,
    unit: 340,
    revenue: 420,
    profit: 500
};

// Header Background
doc
    .save()
    .fillColor('#2563eb')
    .rect(startX, y, 520, 25)
    .fill()
    .restore();

// Header Text
doc
    .fillColor('white')
    .fontSize(10);

doc.text('Customer', columns.customer + 5, y + 7);
doc.text('Product', columns.product + 5, y + 7);
doc.text('Qty', columns.qty + 5, y + 7);
doc.text('Unit Price', columns.unit + 5, y + 7);
doc.text('Revenue', columns.revenue + 5, y + 7);
doc.text('Profit', columns.profit + 5, y + 7);

y += 25;

// Draw Sales Rows
sales.forEach((sale, index) => {

    totalRevenue += sale.revenue;
    totalProfit += sale.profit;

    // Alternate row colors
    if (index % 2 === 0) {
        doc
            .save()
            .fillColor('#f5f5f5')
            .rect(startX, y, 520, 25)
            .fill()
            .restore();
    }

    // Row Border
    doc
        .rect(startX, y, 520, 25)
        .stroke('#cccccc');

    doc
        .fillColor('black')
        .fontSize(9);

    doc.text(
        sale.customerName || 'Walk-in',
        columns.customer + 5,
        y + 7,
        { width: 95 }
    );

    doc.text(
        sale.productName,
        columns.product + 5,
        y + 7,
        { width: 130 }
    );

    doc.text(
        sale.quantitySold.toString(),
        columns.qty + 5,
        y + 7,
        { width: 25, align: 'center' }
    );

    doc.text(
        `UGX ${sale.unitPrice.toLocaleString()}`,
        columns.unit,
        y + 7,
        { width: 70, align: 'right' }
    );

    doc.text(
        `UGX ${sale.revenue.toLocaleString()}`,
        columns.revenue,
        y + 7,
        { width: 70, align: 'right' }
    );

    doc.text(
        `UGX ${sale.profit.toLocaleString()}`,
        columns.profit,
        y + 7,
        { width: 60, align: 'right' }
    );

    y += 25;

    // New page if necessary
    if (y > 730) {

        doc.addPage();

        y = 60;

        // Draw Header Again
        doc
            .save()
            .fillColor('#2563eb')
            .rect(startX, y, 520, 25)
            .fill()
            .restore();

        doc
            .fillColor('white')
            .fontSize(10);

        doc.text('Customer', columns.customer + 5, y + 7);
        doc.text('Product', columns.product + 5, y + 7);
        doc.text('Qty', columns.qty + 5, y + 7);
        doc.text('Unit Price', columns.unit + 5, y + 7);
        doc.text('Revenue', columns.revenue + 5, y + 7);
        doc.text('Profit', columns.profit + 5, y + 7);

        y += 25;
    }

});

// Summary
y += 20;

doc
    .fontSize(13)
    .fillColor('black');

doc.text(
    `Total Sales: ${sales.length}`,
    340,
    y
);

doc.text(
    `Total Revenue: UGX ${totalRevenue.toLocaleString()}`,
    340,
    y + 20
);

doc.text(
    `Total Profit: UGX ${totalProfit.toLocaleString()}`,
    340,
    y + 40
);

};

module.exports = generateSalesPDF;