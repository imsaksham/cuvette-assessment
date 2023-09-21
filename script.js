const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const twilio = require('twilio');
const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000);

  client.messages.create({
    to: phoneNumber,
    from: TWILIO_PHONE_NUMBER,
    body: `Your OTP is: ${otp}`,
  })
    .then(() => {
      res.status(200).json({ message: 'OTP sent successfully' });
    })
    .catch(err => {
      console.error('Error sending OTP:', err);
      res.status(500).json({ error: 'Failed to send OTP' });
    });
});
