const { getAll, create, getById, deleteById, update, commentPet } = require('../services/petService');
const { parseError } = require('../util/parser');

const petController = require('express').Router();


petController.get('/', async (req, res) => {
    const pets = await getAll();

    res.render('catalog', {
        user: req.user,
        pets
    });
});



petController.get('/:id/details', async (req, res) => {
    const pet = await getById(req.params.id);

    if (!req.user) {
        pet.canComment = false;
        pet.isOwner = false;
    }
    else if (pet.owner._id.toString() == req.user._id.toString()) {
        pet.isOwner = true;
        pet.canComment = false;
    }
    else {
        pet.canComment = true;
    }

    console.log(pet);

    res.render('details', {
        pet
    });
});


petController.get('/create', (req, res) => {
    res.render('create', {});
});


petController.post('/create', async (req, res) => {
    const pet = {
        name: req.body.name,
        image: req.body.image,
        age: Number(req.body.age),
        description: req.body.description,
        location: req.body.location,
        owner: req.user._id,
    };


    try {

        if (Object.values(pet).some(v => !v)) {
            throw new Error('All fields are required');
        }

        await create(pet);
        res.redirect('/pets');
    } catch (err) {
        res.render('create', {
            body: pet,
            errors: parseError(err)
        });
    }
});


petController.get('/:id/edit', async (req, res) => {
    const pet = await getById(req.params.id);

    if (pet.owner._id.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        pet
    });
});


petController.post('/:id/edit', async (req, res) => {
    const pet = await getById(req.params.id);

    if (pet.owner._id.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    const edited = {
        name: req.body.name,
        age: Number(req.body.age),
        description: req.body.description,
        location: req.body.location,
        image: req.body.image,
    };


    try {

        if (Object.values(edited).some(v => !v)) {
            throw new Error('All fields are required');
        }

        await update(req.params.id, edited);
        res.redirect(`/pets/${req.params.id}/details`);
    } catch (err) {

        res.render('edit', {
            pet: Object.assign(edited, { _id: req.params.id }),
            errors: parseError(err)
        });
    }
});



petController.get('/:id/delete', async (req, res) => {
    const pet = await getById(req.params.id);

    if (pet.owner._id.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/pets');
});




petController.post('/:id/comment', async (req, res) => {
    const pet = await getById(req.params.id);

    try {
        if (pet.owner._id.toString() == req.user._id.toString()) {
            pet.isOwner = true;
            throw new Error('Cannot comment your own pet');
        }

        await commentPet(req.params.id, req.user._id, req.body.comment);
        res.redirect(`/pets/${req.params.id}/details`);
    } catch (err) {
        res.render('details', {
            pet,
            errors: parseError(err)
        });
    }

});




module.exports = petController;