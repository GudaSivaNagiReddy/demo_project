import express, { Request, Response } from '../../typeScript/node_modules/@types/express';
import axios from '../../typeScript/node_modules/axios';
import User, { IUser } from '../models/user';

const router = express.Router();

// Create or update user data
router.post('/', async (req: Request, res: Response) => {
  try {
    const userData = req.body.data;

    // Check if the user already exists
    let user: IUser | null = await User.findOne({ user_id: userData.user_id });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User(userData);
    } else {
      // If user exists, update the data
      user.set(userData);
    }

    // Fetch weather data using OpenWeatherMap API
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${user.accounts.city}&appid=<your_api_key>`
    );

    user.accounts.weather = {
      temp: weatherResponse.data.main.temp,
      humidity: weatherResponse.data.main.humidity,
    };

    // Save user data to MongoDB
    await user.save();

    res.status(201).json({ message: 'User data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read user data (anonymous access)
router.get('/:user_id', async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;

    // Find user data by user_id
    const user = await User.findOne({ user_id });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
