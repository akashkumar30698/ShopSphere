import React, { useState } from "react";
import { useLogin } from "../ContextApi/loginContext";
import "../App.css"

export default function Accordion() {

  // Define items for different categories
  const items = {
    Clothes: [
      { name: "Shirt", stock: 300 },
      { name: "Shorts & Jeans", stock: 60 },
      { name: "Jacket", stock: 50 },
      { name: "Dress & Frock", stock: 87 },
      { name: "Sweater", stock: 120 },
    ],
    Footwear: [
        { name: "Sports", stock: 30 },
        { name: "Formal", stock: 60 },
        { name: "Casual", stock: 50 },
        { name: "Safety Shoes", stock: 87 },
    ],
     Jewelry: [
        { name: "Earrings", stock: 46 },
        { name: "Couple Rings", stock: 73 },
        { name: "Necklace", stock: 61 },
     ],

     Perfume: [
        { name: "Clothes Perfume", stock: 12 },
        { name: "Deodorant", stock: 60 },
        { name: "Jacket", stock: 50 },
        { name: "Dress & Frock", stock: 87 },
     ],

     Cosmetics: [
        { name: "Shampoo", stock: 68 },
        { name: "Sunscreen", stock: 46 },
        { name: "Body Wash", stock: 79 },
        { name: "Makeup Kit", stock: 23 },
     ],

     Glasses: [
        { name: "Sunglasses", stock: 50 },
        { name: "Lenses", stock: 48 },
     ],

    Bags: [
      { name: "Backpack", stock: 20 },
      { name: "Handbag", stock: 15 },
      { name: "Messenger Bag", stock: 90 },
      { name: "Tote Bag", stock: 70 },
    ],
  };



  // State to keep track of the selected category
  const { selectedCategory } = useLogin()
 

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}

      className="width"
    >
      <div
        style={{
          width: "235.5px",
          backgroundColor: "rgb(255, 255, 255)",
          borderRadius: "6px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Category Buttons */}
      
        {/* Display items based on selected category */}
        {items[selectedCategory].map((item, index) => (
          <a
            key={index}
            href="#"
            style={{
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "rgb(33, 33, 33)",
              fontSize: "14.875px",
              padding: "8px",
              textDecoration: "none",
              borderBottom:
                index < items[selectedCategory].length - 1
                  ? "1px solid #eee"
                  : "none", // Add bottom border except for the last item
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  marginRight: "8px",
                }}
              />
              <p
                style={{
                  boxSizing: "border-box",
                  textTransform: "capitalize",
                  margin: "0px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {item.name}
              </p>
            </div>
            <data
              value={item.stock}
              title="Available Stock"
              style={{
                boxSizing: "border-box",
                padding: "0px",
                margin: "0px",
                fontWeight: "bold",
              }}
            >
              {item.stock}
            </data>
          </a>
        ))}
      </div>
    </div>
  );
}
