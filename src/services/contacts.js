const Contact = require('../models/contact');

async function getAllContacts() {
  return Contact.find({});
}

async function getContactById(id) {
  return Contact.findById(id);
}

module.exports = {
  getAllContacts,
  getContactById,
};

