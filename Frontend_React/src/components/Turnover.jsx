import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const timePeriods = ['1 Jour', '3 Mois', '6 Mois', '1 An'];

function Turnover({ salesData, productData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[0]);
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [bestSellingItems, setBestSellingItems] = useState([]);
  const [topSellingArticles, setTopSellingArticles] = useState([]);

  useEffect(() => {
    if (salesData.length) {
      setTotalSalesValue(salesData.reduce((total, sale) => total + sale.total_price, 0));
      setBestSellingItems(getBestSellingItems(salesData));
      setTopSellingArticles(getTopSellingArticles(salesData));
      renderChart(selectedTimePeriod, salesData);
    }
  }, [selectedTimePeriod, salesData]);

  const renderChart = (timePeriod, data) => {
    chartInstance.current?.destroy();
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: getLabelsForTimePeriod(timePeriod),
        datasets: [{
          label: "Turnover",
          data: getDataForTimePeriod(timePeriod, data),
          borderColor: 'rgb(10,225,70)',
          tension: 0.1,
          fill: false,
        }],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        elements: { line: { borderWidth: 2 } },
      },
    });
  };

  const getLabelsForTimePeriod = (period) => {
    const labelsMap = {
      '1 Jour': ['0-3h', '3-6h', '6-9h', '9-12h', '12-15h', '15-18h', '18-21h', '21-24h'],
      '3 Mois': ['Avr', 'Mai', 'Juin'],
      '6 Mois': ['Jan', 'Avr', 'Juil'],
      '1 An': ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    };
    return labelsMap[period] || [];
  };

  const getDataForTimePeriod = (period, data) => {
    const currentYear = new Date().getFullYear();

    switch (period) {
      case '1 Jour':
        return aggregateData(data, 8, (sale, i) => Math.floor(new Date(sale.created_at).getHours() / 3) === i);
      case '3 Mois':
        return aggregateData(data, 3, (sale, i) => new Date(sale.created_at).getFullYear() === currentYear && new Date(sale.created_at).getMonth() === i + 3);
      case '6 Mois':
        return aggregateData(data, 6, (sale, i) => new Date(sale.created_at).getFullYear() === currentYear && [0, 3, 6, 9].includes(new Date(sale.created_at).getMonth()));
      case '1 An':
        return aggregateData(data, 12, (sale, i) => new Date(sale.created_at).getFullYear() === currentYear && new Date(sale.created_at).getMonth() === i);
      default:
        return [];
    }
  };

  const aggregateData = (data, size, condition) => Array(size).fill(0).map((_, i) => data.filter((sale) => condition(sale, i)).reduce((sum, sale) => sum + sale.total_price, 0));

  const getBestSellingItems = (data) => [...data]
    .sort((a, b) => b.total_price - a.total_price)
    .slice(0, 8)
    .map((sale) => ({
      article: sale.order_number,
      total: sale.total_price,
    }));

  const getTopSellingArticles = (data) => {
    // This assumes your salesData has article information
    // If not, you'll need to modify this to match your data structure
    const articleMap = {};

    data.forEach((sale) => {
      // Modify this line based on how articles are stored in your data
      const articleName = sale.article || `Article ${sale.id}`;
      articleMap[articleName] = (articleMap[articleName] || 0) + 1;
    });

    return Object.entries(articleMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([article, quantity]) => ({ article, quantity }));
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-around mb-auto">
        {/* Main Chart */}
        <div className="w-[55%] bg-white p-2.5 m-5 rounded-lg shadow-md">
          <div className="flex items-center border-b-2 border-gray-300 pb-2">
            <h3 className="text-lg font-semibold">Turnover</h3>
            <div className="ml-auto font-bold">{totalSalesValue.toFixed(2)} MAD</div>
          </div>
          <div className="mt-2.5 mb-2.5">
            <ul className="flex justify-around list-none">
              {timePeriods.map((period) => (
                <li
                  key={period}
                  className={`px-2.5 py-1 rounded-full text-sm font-semibold cursor-pointer ${
                    selectedTimePeriod === period ? 'bg-green-500 text-white' : 'bg-gray-100'
                  }`}
                  onClick={() => setSelectedTimePeriod(period)}
                >
                  {period}
                </li>
              ))}
            </ul>
          </div>
          <div className="graph">
            <canvas ref={chartRef} height={220} width={600} />
          </div>
        </div>

        {/* Best Selling Items */}
        <div className="w-[20%] bg-white p-2.5 m-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Best Sellers</h3>
          <ul className="mt-2.5">
            {bestSellingItems.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600 mt-2.5">
                {item.article} <span className="font-bold ml-10">{item.total} MAD</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Selling Articles */}
        <div className="w-[20%] bg-white p-2.5 m-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Low Stock</h3>
          <ul className="mt-2.5">
            {productData.filter((item) => item.stock < 20).length > 0 ? (
              productData.map((item, index) => (
                item.stock < 20 && (
                <li key={index} className="flex justify-between text-red-600 mt-2.5">
                  {item.name.length > 20 ? `${item.name.slice(0, 15)}...` : item.name} <span className="font-bold ml-10">{item.stock}</span>
                </li>
                )
              ))
            ) : (
              <p className="pr-5">No products are near to out of stock</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Turnover;
