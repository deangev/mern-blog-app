const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../modelsAndSchemas/userModel');
const Conversation = require('../modelsAndSchemas/conversationsModel');

router.post('/contact', async (req, res) => {
    try {
        let { id, email } = req.body;

        const findUser = await User.findOne({ email: email })
        if (!findUser)
            return res.status(400).json({ message: 'No receiver id has been found' })

        const existingContacts = findUser.contacts;
        const checkId = obj => obj.id === id;
        if (existingContacts.some(checkId))
            return res.status(400).json({ message: "Contact already exist" })

        const newContact = await User.findById(id)

        const newId = await User.findOneAndUpdate({ email: email }, {
            $push: {
                contacts: {
                    id: newContact.id,
                    name: newContact.firstName
                }
            }
        })
        res.json(newId)
    } catch (err) {
        // res.status(500).json({ message: err.message })
        res.status(500).json({ message: "Id not found" })
    }
});

router.get('/get-contacts', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const contacts = user.contacts;
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/delete-contact', async (req, res) => {
    try {
        const { userId, contactId } = req.body;
        const deletedUser = await User.findByIdAndUpdate(userId, {
            $pull: {
                contacts: { id: contactId }
            }
        })
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/conversation', async (req, res) => {
    try {
        let { name, contacts } = req.body;
        if (contacts.length === 1)
            return res.status(400).json({ message: 'Please add at least 1 contact' });

        const newConversation = new Conversation({
            name,
            contacts
        });
        const savedConversation = await newConversation.save();
        res.json(savedConversation)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/add-contacts-to-conversation', async (req, res) => {
    try {
        const { contacts, conversationId } = req.body;
        const newContacts = await Conversation.findByIdAndUpdate(conversationId, {
            $push: {
                contacts: contacts
            }
        })
        res.json(newContacts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/get-conversations', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const conversations = await Conversation.find({ "contacts.id": user._id })
        let conversationArray = conversations.map(a => {
            return {
                id: a._id,
                name: a.name,
                contacts: a.contacts.map(contact => contact),
                // contacts: a.contacts.map(contact => contact.name),
                messages: a.messages
            }
        })

        res.json(conversationArray)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/delete-conversation-contact', async (req, res) => {
    try {
        const { userId, conversationId } = req.body;
        const deletedUser = await Conversation.findByIdAndUpdate(conversationId, {
            $pull: {
                contacts: {
                    id: userId
                }
            }
        })
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/delete-conversation', async (req, res) => {
    try {
        const { userId, conversationId } = req.body;
        const deletedConversation = await Conversation.findByIdAndUpdate(conversationId, {
            $pull: {
                contacts: {
                    id: userId
                }
            }
        })
        const checkEmpty = await Conversation.findById(conversationId);
        if (checkEmpty.contacts.length === 0) {
            await Conversation.findByIdAndRemove(conversationId)
        }
        res.json(deletedConversation);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/message', async (req, res) => {
    try {
        let { content, conversation, senderId, senderName } = req.body;
        const newMessage = await Conversation.findOneAndUpdate({ _id: conversation }, {
            $push: {
                messages: {
                    senderId: senderId,
                    senderName: senderName,
                    content: content
                }
            }
        })

        return res.json(newMessage)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router;