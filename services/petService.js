const Pet = require("../models/Pet");

async function getAll() {
    return Pet
        .find({})
        .populate({ path: 'owner', select: 'username' })
        .lean();
}

async function getById(id) {
    return Pet
    .findById(id)
    .populate({ path: 'owner', select: 'username' })
    // .populate('commentList')
    .lean();
}

async function getUserPets(userId){
    return await Pet.find({owner: userId}).lean();
}

async function create(pet) {
    return await Pet.create(pet);
}

async function update(id, pet) {
    const existing = await Pet.findById(id);

    existing.name = pet.name;
    existing.age = pet.age;
    existing.description = pet.description;
    existing.location = pet.location;
    existing.image = pet.image;

    await existing.save();
}

async function deleteById(id) {
    await Pet.findByIdAndRemove(id);
}

async function commentPet(petId, userId, comment) {
    const pet = await Pet.findById(petId);

    pet.commentList.push({userId, comment});
    await pet.save();
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    commentPet,
    getUserPets
};