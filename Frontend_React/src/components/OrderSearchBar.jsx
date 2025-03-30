import React from 'react';
import { HiSearch } from 'react-icons/hi';
import { useSelector } from 'react-redux';

function OrderSearchBar({ filterText, setFilterText, onSearch }) {
    const { orders = [] } = useSelector((state) => state.orders);

    const handleStatusFilter = (status) => {
        setFilterText(status);
        onSearch();
    };

    const calcNumOfOrdersByStatus = (status) => {
        return orders.filter((order) => order.status === status).length || 0;
    };

    const isFiltred = (text) => {
        return filterText === text;
    }

    return (
        <div className='bg-white p-4 rounded shadow mb-4'>
            <div className="mb-4 flex justify-between items-center w-2/3">
                <p onClick={() => handleStatusFilter('')} className={`cursor-pointer hover:text-blue-500 ${isFiltred('') && 'font-bold underline underline-offset-4  text-blue-500'}`}>View all</p>
                <p onClick={() => handleStatusFilter('To pay')} className={`cursor-pointer hover:text-blue-500 ${isFiltred('To pay') && 'font-bold underline underline-offset-4 text-blue-500'}`}>To pay ({calcNumOfOrdersByStatus("To pay")})</p>
                <p onClick={() => handleStatusFilter('To ship')} className={`cursor-pointer hover:text-blue-500 ${isFiltred('To ship') && 'font-bold underline underline-offset-4 text-blue-500'}`}>To ship ({calcNumOfOrdersByStatus("To ship")})</p>
                <p onClick={() => handleStatusFilter('Shipped')} className={`cursor-pointer hover:text-blue-500 ${isFiltred('Shipped') && 'font-bold underline underline-offset-4 text-blue-500'}`}>Shipped ({calcNumOfOrdersByStatus("Shipped")})</p>
                <p onClick={() => handleStatusFilter('Processed')} className={`cursor-pointer hover:text-blue-500 ${isFiltred('Processed') && 'font-bold underline underline-offset-4 text-blue-500'}`}>Processed</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center w-3/4">
                    <input
                        type="text"
                        placeholder="Order ID, product, or store name"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="border p-2 rounded-l w-full max-w-xl"
                    />
                    <button
                        onClick={onSearch}
                        className="bg-orange-500 text-white px-4 py-3 rounded-r hover:bg-orange-600"
                    >
                        <HiSearch />
                    </button>
                </div>
                <select className="border p-2 rounded">
                    <option value="all">All / Last year</option>
                    <option value="lastMonth">Last month</option>
                    <option value="lastWeek">Last week</option>
                </select>
            </div>
        </div>
    );
}

export default OrderSearchBar;