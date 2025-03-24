import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const timePeriods = ['1 Jour', '3 Mois', '6 Mois', '1 An'];

function Turnover({ salesData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[0]);
  const [bestSellingItems, setBestSellingItems] = useState([]);
  const [topSellingArticles, setTopSellingArticles] = useState([]);
  const [totalSalesValue, setTotalSalesValue] = useState(0);

  useEffect(() => {
    if (salesData.length) {
      const processedData = processSalesData(salesData);
      setBestSellingItems(getBestSellingItems(processedData));
      setTopSellingArticles(getTopSellingArticles(processedData));
      setTotalSalesValue(processedData.reduce((total, sale) => total + sale.total, 0));
      renderChart(selectedTimePeriod, processedData);
    }
  }, [selectedTimePeriod, salesData]);

  const processSalesData = (sales) => sales.map((sale) => ({
    ...sale,
    total: sale.unit_price * sale.quantity,
    date: new Date(sale.created_at),
  }));

  const renderChart = (timePeriod, data) => {
    chartInstance.current?.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: getLabelsForTimePeriod(timePeriod),
        datasets: [{
          label: 'Nombre de ventes',
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
      '3 Mois': ['Jan', 'Fév', 'Mar'],
      '6 Mois': ['Jan', 'Avr', 'Juil'],
      '1 An': ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    };
    return labelsMap[period] || [];
  };

  const getDataForTimePeriod = (period, data) => {
    const currentYear = new Date().getFullYear();

    switch (period) {
      case '1 Jour':
        return aggregateData(data, 8, (sale, i) => Math.floor(sale.date.getHours() / 3) === i);
      case '3 Mois':
        return aggregateData(data, 3, (sale, i) => sale.date.getFullYear() === currentYear && sale.date.getMonth() === i);
      case '6 Mois':
        return aggregateData(data, 6, (sale, i) => sale.date.getFullYear() === currentYear && [0, 3, 6, 9].includes(sale.date.getMonth()));
      case '1 An':
        return aggregateData(data, 12, (sale, i) => sale.date.getFullYear() === currentYear && sale.date.getMonth() === i);
      default:
        return [];
    }
  };

  const aggregateData = (data, size, condition) => Array(size).fill(0).map((_, i) => data.filter((sale) => condition(sale, i)).length);

  const getBestSellingItems = (data) => [...data]
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const getTopSellingArticles = (data) => {
    const articleMap = data.reduce((acc, sale) => {
      acc[sale.article] = (acc[sale.article] || 0) + sale.quantity;
      return acc;
    }, {});

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
            <h3 className="text-lg font-semibold">Ventes</h3>
            <div className="ml-auto font-bold">{totalSalesValue.toFixed(2)}$</div>
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
          <h3 className="text-lg font-semibold">Meilleures Ventes</h3>
          <ul className="mt-2.5">
            {bestSellingItems.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600 mt-2.5">
                {item.article} <span className="font-bold ml-10">${item.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Selling Articles */}
        <div className="w-[20%] bg-white p-2.5 m-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Articles les plus vendus</h3>
          <ul className="mt-2.5">
            {topSellingArticles.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600 mt-2.5">
                {item.article} <span className="font-bold ml-10">{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Turnover;
