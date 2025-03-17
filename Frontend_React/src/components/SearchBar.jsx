import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { filterProducts } from '../redux/features/productSlice'

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('')
    const dispatch = useDispatch()

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        dispatch(filterProducts(e.target.value))
    }

    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    )
}