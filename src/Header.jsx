import React, { useState, useEffect } from "react";
import Cards from "./Components/Cards";

const RecipeFinder = () => {
  const [query, setQuery] = useState(" ");
  const [filter, setFilter] = useState(" ");
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipeDetails = async (idMeal) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        if (data.meals) 
        {
          const detailedMeals = await Promise.all(
            data.meals.map((meal) => fetchRecipeDetails(meal.idMeal)) );
          setAllRecipes(detailedMeals);
          setRecipes(detailedMeals);
        }
         else {
          setError("No  recipes  found");
        }
      } catch (error) {
        setError("Error fetching recipes. Please try again.");
      }
      setLoading(false);
    };

    fetchRandomRecipes();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/categories.php`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchRecipes = async (query) => {
    setLoading(true);
    setError("");
    try {
      let response;
      if (filter) {
        response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filter}`
        );
      } else {
        response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();

      if (data.meals) {
        const detailedMeals = await Promise.all(
          data.meals.map((meal) => fetchRecipeDetails(meal.idMeal))
        );
        setRecipes(detailedMeals);
      } else {
        setError("No recipes found");
      }
    } catch (error) {
      setError("Error fetching recipes. Please try again.");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query || filter) {
      fetchRecipes(query);
    } else {
      setRecipes(allRecipes);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9967a] p-6">
      <h1 className="text-5xl font-bold text-center text-[#2B2D42]">
        Recipe Finder
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center w-full justify-evenly mt-8 p-4 gap-8"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          
          placeholder="Search for recipes"
          className="p-3 border border-gray-300  rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B2D42] text-black"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3  border-gray-300 rounded-md w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B2D42]"
        >
          <option value="">Filter by category</option>
          {categories.map((category) => (
            <option key={category.idCategory} value={category.strCategory}>
              {category.strCategory}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="relative h-[50px] w-full  md:w-1/3 overflow-hidden rounded-md bg-white text-black shadow-2xl hover:text-black hover:shadow-[#fcc191ac] hover:before:h-2/4 hover:after:h-2/4 hover:bg-[#ffebcd] transition duration-300 hover:border-gray-300"
        >
          <span className="relative z-10">Search</span>
        </button>
      </form>

      {loading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-center text-[#2B2D42]">{error}</p>}

      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 p-2">
          {recipes.map((recipe, index) => (
            <Cards  recipe={recipe} key={index}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeFinder;
