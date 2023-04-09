const { hasUser } = require('../middlewares/guards');
const { getUserPets } = require('../services/petService');

const profileController = require('express').Router();


profileController.get('/', hasUser(), async (req, res) => {
    const pets = await getUserPets(req.user._id);

    console.log(pets);
    console.log(Object.assign({pets}, req.user));
    res.render('profile', {
        user: Object.assign({pets}, req.user)
    });
});


module.exports = profileController;