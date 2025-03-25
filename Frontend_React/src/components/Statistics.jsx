import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import arrow from '../assets/images/arrow.png';

function Statistics({ ordersData, productsData, clientsData }) {
  const ordersChartRef = useRef(null);
  const productsChartRef = useRef(null);
  const clientsChartRef = useRef(null);
  const ordersChartInstance = useRef(null);
  const productsChartInstance = useRef(null);
  const clientsChartInstance = useRef(null);

  useEffect(() => {
    if (ordersChartInstance.current) ordersChartInstance.current.destroy();
    if (productsChartInstance.current) productsChartInstance.current.destroy();
    if (clientsChartInstance.current) clientsChartInstance.current.destroy();

    const ordersDataAggregated = aggregateDataByDay(ordersData);
    const productsDataAggregated = aggregateDataByDay(productsData);
    const clientsDataAggregated = aggregateDataByDay(clientsData);

    const newOrdersChartInstance = createChart(ordersChartRef, ordersDataAggregated, ordersComparison.isPositive);
    const newProductsChartInstance = createChart(productsChartRef, productsDataAggregated, productsComparison.isPositive);
    const newClientsChartInstance = createChart(clientsChartRef, clientsDataAggregated, clientsComparison.isPositive);

    ordersChartInstance.current = newOrdersChartInstance;
    productsChartInstance.current = newProductsChartInstance;
    clientsChartInstance.current = newClientsChartInstance;
  }, [ordersData, productsData, clientsData]);

  const aggregateDataByDay = (data) => {
    const hoursInDay = 24;
    const interval = 3;
    const aggregatedData = Array(hoursInDay / interval).fill(0);

    data.forEach((item) => {
      const date = new Date(item.created_at);
      const hour = date.getHours();
      const index = Math.floor(hour / interval);
      aggregatedData[index]++;
    });

    return aggregatedData;
  };

  const createChart = (chartRef, data, isPositive) => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['0-3h', '3-6h', '6-9h', '9-12h', '12-15h', '15-18h', '18-21h', '21-24h'],
          datasets: [{
            data,
            borderWidth: 2,
            borderColor: isPositive ? '#0ae146' : '#F40C0C',
            tension: 0.1,
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
          interaction: {
            mode: 'nearest',
            intersect: false,
          },
          elements: {
            point: {
              radius: 0,
            },
            line: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
            },
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
        },
      });
    }
    return null;
  };

  const compareWithYesterday = (todayData, yesterdayData) => {
    const todayAvg = calculateAverage(todayData);
    const yesterdayAvg = calculateAverage(yesterdayData);
    const difference = todayAvg - yesterdayAvg;
    return {
      difference: difference.toFixed(1),
      isPositive: difference >= 0,
    };
  };

  const calculateAverage = (data) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    return (total / data.length).toFixed(1);
  };

  const getDataForYesterday = (data) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return data.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate.getDate() === yesterday.getDate()
        && itemDate.getMonth() === yesterday.getMonth()
        && itemDate.getFullYear() === yesterday.getFullYear();
    });
  };

  const ordersYesterday = getDataForYesterday(ordersData);
  const productsYesterday = getDataForYesterday(productsData);
  const clientsYesterday = getDataForYesterday(clientsData);

  const ordersComparison = compareWithYesterday(aggregateDataByDay(ordersData), aggregateDataByDay(ordersYesterday));
  const productsComparison = compareWithYesterday(aggregateDataByDay(productsData), aggregateDataByDay(productsYesterday));
  const clientsComparison = compareWithYesterday(aggregateDataByDay(clientsData), aggregateDataByDay(clientsYesterday));

  return (
    <div className="w-[97.5%] m-auto">
      <div className="flex flex-row justify-around gap-2">
        <div className="w-1/3 ml-1 flex h-36 rounded-xl bg-white">
          <div className="ml-2 w-1/2">
            <h3 className="font-semibold p-1.5 text-xl">Orders</h3>
            <h2 className="font-normal text-2xl p-1.5">{ordersData.length}</h2>
            <div className="flex items-center h-0 mt-3 ml-1">
              <img src={arrow} alt="" className="w-5 h-5 mr-5" />
              <p>Depuis hier</p>
            </div>
          </div>
          <div className="w-2/5 mt-7 flex flex-col items-end justify-center">
            <canvas ref={ordersChartRef} />
            <p className={`font-semibold pr-5 pb-7 ${ordersComparison.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {ordersComparison.difference >= 0 ? '+' : ''}{ordersComparison.difference}%
            </p>
          </div>
        </div>
        <div className="w-1/3 ml-1 flex h-36 rounded-xl bg-white">
          <div className="ml-2 w-1/2">
            <h3 className="font-semibold p-1.5 text-xl">Products</h3>
            <h2 className="font-normal text-2xl p-1.5">{productsData.length}</h2>
            <div className="flex items-center h-0 mt-3 ml-1">
              <img src={arrow} alt="" className="w-5 h-5 mr-5" />
              <p>Depuis hier</p>
            </div>
          </div>
          <div className="w-2/5 mt-7 flex flex-col items-end justify-center">
            <canvas ref={productsChartRef} />
            <p className={`font-semibold pr-5 pb-7 ${productsComparison.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {productsComparison.difference >= 0 ? '+' : ''}{productsComparison.difference}%
            </p>
          </div>
        </div>
        <div className="w-1/3 ml-1 flex h-36 rounded-xl bg-white">
          <div className="ml-2 w-1/2">
            <h3 className="font-semibold p-1.5 text-xl">Clients</h3>
            <h2 className="font-normal text-2xl p-1.5">{clientsData.length}</h2>
            <div className="flex items-center h-0 mt-3 ml-1">
              <img src={arrow} alt="" className="w-5 h-5 mr-5" />
              <p>Depuis hier</p>
            </div>
          </div>
          <div className="w-2/5 mt-7 flex flex-col items-end justify-center">
            <canvas ref={clientsChartRef} />
            <p className={`font-semibold pr-5 pb-7 ${clientsComparison.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {clientsComparison.difference >= 0 ? '+' : ''}{clientsComparison.difference}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
