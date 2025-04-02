import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filterProducts } from '../redux/features/productSlice'
import { fetchCategories } from '../redux/features/categorySlice'
import { HiClipboardList } from 'react-icons/hi'

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('')
    const [idCategory, setIdCategory] = useState();
    const dispatch = useDispatch()
    const { items } = useSelector((state) => state.categories) // Assuming categories are stored in categorySlice

    useEffect(() => {
        dispatch(fetchCategories())
    }, [idCategory])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        dispatch(filterProducts(e.target.value))
    }

    const handleSearchByCategory = (e) => {
        setIdCategory(e.target.value)
        dispatch(filterProducts(e.target.value))
    }
    return (
        <div className="flex justify-between items-center gap-2">
            <input
                type="text"
                placeholder="Search products..."
                className="w-3/4 p-2 border rounded "
                value={searchTerm}
                onChange={handleSearch}
            />
            {items && <select
                className="w-1/4 p-2 border rounded"
                value={idCategory}
                onChange={handleSearchByCategory}
            >
                <option value="">All Categories</option>
                {items.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>}
        </div>
    )
}