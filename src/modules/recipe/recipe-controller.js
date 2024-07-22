const Recipe = require('./recipe-model');

const recipes = [
    { id: 1, name: 'Biryani', description: 'Biryani is a mixed rice dish originating among the Muslims of the Indian subcontinent.' },
    { id: 2, name: 'Pulao', description: 'Pulao is a rice dish in which rice is cooked in a seasoned broth.' },
    { id: 3, name: 'Karahi', description: 'Karahi is a type of curry which is made in a karahi.' }
]

async function getAllRecipes(req, res) {
    const recipes = await Recipe.find();
    res.json(recipes);
}

async function getRecipeById(req, res) {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    res.json(recipe);
}

async function searchRecipe(req, res) {
    const { query } = req.params;
    const recipe = await Recipe.find({ condition: { $regex: query, $options: 'i' } });
    res.json(recipe);
}

async function createRecipe(req, res) {
    const recipe = new Recipe({
        title: req.body.title,
        description: req.body.description,
        prepTime: req.body.prepTime,
        serves: req.body.serves,
        imgSrc: req.body.imgSrc,
        condition: req.body.condition
    });
    try {
        await recipe.save();
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateRecipe(req, res) {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (req.body.title) {
            recipe.title = req.body.title;
        }
        if (req.body.description) {
            recipe.description = req.body.description;
        }
        if (req.body.prepTime) {
            recipe.prepTime = req.body.prepTime;
        }
        if (req.body.serves) {
            recipe.serves = req.body.serves;
        }
        if (req.body.imgSrc) {
            recipe.imgSrc = req.body.imgSrc;
        }
        if (req.body.condition) {
            recipe.condition = req.body.condition;
        }
        await recipe.save();
        res.json(recipe);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
}

async function deleteRecipe(req, res) {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


module.exports = {
    getAllRecipes,
    getRecipeById,
    searchRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
}