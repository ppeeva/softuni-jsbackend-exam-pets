const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const petController = require("../controllers/petsController");
const profileController = require("../controllers/profileController");


module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/pets', petController);
    app.use('/profile', profileController);

    app.use('/*', (req, res) => {
        res.render('404');
    });
};