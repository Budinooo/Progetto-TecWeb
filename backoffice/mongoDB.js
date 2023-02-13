// Import Mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

// Compile the User Model
const User = mongoose.model('User', userSchema);

// Handle the Registration Request
app.post('/register', (req, res) => {
    // Validate the Request Body
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the Email Already Exists
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) return res.status(500).send('Error on the server.');
        if (existingUser) return res.status(400).send('Email already exists.');

        // Create a New User
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        });

        // Save the User to the Database
        user.save((err, savedUser) => {
            if (err) return res.status(500).send('Error on the server.');
            res.send(savedUser);
        });
    });
});