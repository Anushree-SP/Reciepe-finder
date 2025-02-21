import React from "react";

const Cards = ( {recipe}) => {
  return (
    <div
      className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#F4F1DE]"
    >
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="h-40 w-full mb-12 object-cover rounded-lg capitalize hover:scale-[1.05]"
      />
      <div className="p-2">
        <h3 className="mt-2 text-lg font-bold text-[#2B2D42]">
          {recipe.strMeal}
        </h3>
        <p className="text-[#2B2D42] font-semibold">
          Category: {recipe.strCategory}
        </p>
        <button className="bg-transparent  text-gray-800  font-semibold hover:text-white py-1 px-4 justify-center border border-gray-500 hover:border-transparent rounded ">
          {" "}
          <a
            href={
              recipe.strSource ||
              `https://www.themealdb.com/meal/${recipe.idMeal}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2B2D42]   hover:text-zinc-500  block"
          >
            View Recipe
          </a>
        </button>
      </div>
    </div>
  );
};

export default Cards;
