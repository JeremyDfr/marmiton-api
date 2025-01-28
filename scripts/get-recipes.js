import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: '127.0.0.1',
    database: 'marmiton',
    user: 'root',
    password: 'root'
});

const getRecipes = async () => {
    const recipes = [];

    const fetchPage = async (skip = 0) => {
        const response = await fetch(`https://dummyjson.com/recipes?skip=${skip}`);

        const data = await response.json();

        data.recipes.map(recipe => {
            recipes.push(recipe);
        })

        if (recipes.length < data.total) {
            await fetchPage(skip += 30);
        }
    };

    await fetchPage();

    return recipes;
};

const insertRecipeInDatabase = async () => {
    try {
        let count = 0;
        const recipes = await getRecipes();

        for (const recipe of recipes) {
            const [results, fields] = await connection.query(
                'INSERT INTO recipes (name, ingredients, instructions, prep_time_minutes, cook_time_minutes, servings, difficulty, cuisine, calories_per_serving, tags, user_id, image, rating, review_count, meal_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,?)',
                [recipe.name, JSON.stringify(recipe.ingredients), JSON.stringify(recipe.instructions), recipe.prepTimeMinutes, recipe.cookTimeMinutes, recipe.servings, recipe.difficulty, recipe.cuisine, recipe.caloriesPerServing, JSON.stringify(recipe.tags), 1, recipe.image, recipe.rating, recipe.reviewCount, JSON.stringify(recipe.mealType)]
            );

            count++;
        }

        console.log(count);
    } catch (error) {
        console.log(error);
    }
}

insertRecipeInDatabase();
