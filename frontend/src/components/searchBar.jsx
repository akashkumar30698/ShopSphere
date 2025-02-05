"use client"

import  React from "react"
import { useState, useEffect, useRef } from "react"
import { getProducts } from "../actions/getProducts"
import { useLogin } from "../ContextApi/loginContext"

const dummyProducts = [
  { id: 101, name: "Apple", type: "dummy" },
  { id: 102, name: "Banana", type: "dummy" },
  { id: 103, name: "Orange", type: "dummy" },
  { id: 104, name: "Mango", type: "dummy" },
  { id: 105, name: "Pineapple", type: "dummy" },
]

const SearchBar = () => {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const { products, setProducts } = useLogin()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const vendorProducts = await getProducts()
        console.log("products : ",products)
        setProducts([...dummyProducts, ...vendorProducts])
      } catch (err) {
        setError("Failed to fetch products. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(()=>{
    console.log("products :",products)
  },[products])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)

    if (value) {
      const filteredSuggestions = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.name)
    setSuggestions([])
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSuggestions([])
    }
  }

  return (
    <div className="relative w-64 mx-auto mt-4">
      <label htmlFor="search" className="sr-only">
        Search for a product
      </label>
      <input
        id="search"
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border rounded shadow"
        placeholder="Search for a product..."
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-expanded={suggestions.length > 0}
      />

      {isLoading && <p className="mt-2 text-gray-600">Loading products...</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}

      {suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          className="absolute left-0 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSuggestionClick(suggestion)
                }
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
              role="option"
              tabIndex={0}
            >
              {suggestion.name} ({suggestion.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar

