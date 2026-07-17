const PDFDocument = require('pdfkit-table');

const generateSalesPDF = (sales, filter, res) => {
    // Initialize document
    const doc = new PDFDocument({
        margin: 40,
        size: 'A4'
    });

    // Set HTTP Response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Sales_Report_${filter}.pdf`);

    // Stream directly to response
    doc.pipe(res);

    // Calculate totals dynamically
    let totalRevenue = 0;
    let totalProfit = 0;

    // Map sales array into table-friendly row arrays
    const tableRows = sales.map((sale) => {
        totalRevenue += sale.revenue;
        totalProfit += sale.profit;

        return [
            sale.customerName || 'Walk-in',
            sale.productName,
            sale.quantitySold.toString(),
            `UGX ${sale.unitPrice.toLocaleString()}`,
            `UGX ${sale.revenue.toLocaleString()}`,
            `UGX ${sale.profit.toLocaleString()}`
        ];
    });

    // Append Summary Rows to the bottom of the table
    tableRows.push(
        ['', '', '', '', '', ''], // Empty spacer row
        ['Summary', '', '', '', '', ''],
        ['Total Sales:', sales.length.toString(), '', '', '', ''],
        ['Total Revenue:', `UGX ${totalRevenue.toLocaleString()}`, '', '', '', ''],
        ['Total Profit:', `UGX ${totalProfit.toLocaleString()}`, '', '', '', '']
    );

    // Define table structure and styling configuration
    const tableJson = {
        headers: [
            { label: "Customer", property: "customer", width: 95 },
            { label: "Product", property: "product", width: 130 },
            { label: "Qty", property: "qty", width: 40 },
            { label: "Unit Price", property: "unit", width: 85 },
            { label: "Revenue", property: "revenue", width: 85 },
            { label: "Profit", property: "profit", width: 85 }
        ],
        rows: tableRows
    };

    // Global table options for appearance 
    const tableOptions = {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10).fillColor('white'),
        prepareRow: (row, index) => doc.font("Helvetica").fontSize(9).fillColor('black'),
        padding: 5,
        columnSpacing: 5,
        hideHeader: false,
        minRowHeight: 20
    };

    // Draw the structural table (auto-calculates spacing and page breaks)
    doc.table(tableJson, tableOptions);

    // Finalize PDF Generation
    doc.end();
};

module.exports = generateSalesPDF;
