const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  phoneNumber: String
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { username, password, phoneNumber, otp } = req.body;

  const isValidOTP = await compareOTPWithStoredValue(phoneNumber, otp);
  
  if (!isValidOTP) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Password hashing failed' });
    }

    const newUser = new User({
      username,
      password: hash,
      phoneNumber,
    });

    newUser.save()
      .then(() => {
        res.status(201).json({ message: 'User registered successfully' });
      })
      .catch(err => {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'User registration failed' });
      });
  });
});
