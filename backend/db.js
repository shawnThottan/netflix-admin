import mongoose from 'mongoose';
import City from './models/City';
import Language from './models/Language';
import Theatre from './models/Theatre';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect () {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
      return mongoose
    });

    await initDB();
  }
  cached.conn = await cached.promise;

  return cached.conn;
}

const initDB = async () => {
  await City.exists({}).then(async (doc) => {
    if (doc) { return; }

    await City.insertMany([
      { name: 'Delhi' },
      { name: 'Bangalore' },
      { name: 'Chennai' },
      { name: 'Hyderabad' },
    ])
  });

  await Language.exists({}).then(async (doc) => {
    if (doc) { return; }

    await Language.insertMany([
      { name: 'English' },
      { name: 'Hindi' },
      { name: 'Kannada' },
      { name: 'Tamil' },
      { name: 'Telugu' },
    ])
  });

  await Theatre.exists({}).then(async (doc) => {
    if (doc) { return; }

    const theatre_list = [
      {
        city: 'Delhi',
        theatres: ['PVR Plaza', 'Carnival Cinemas', 'Satyam Cineplexes'],
      },
      {
        city: 'Bangalore',
        theatres: ['INOX Lido', 'Sampige Theatre', 'Urvashi Cinemas'],
      },
      {
        city: 'Chennai',
        theatres: ['Jazz Cinemas LUXE', 'Woodlands Cinemas', 'Albert Theatres'],
      },
      {
        city: 'Hyderabad',
        theatres: ['Prasad\'s Multiplex', 'Carnival Cinemas', 'AMB Cinemas'],
      },
    ]

    for (let { city, theatres } of theatre_list) {
      const { id } = await City.findOne({ name: city });
 
      await Theatre.insertMany(theatres.map((theatre) => ({ name: theatre, city: id })));
    }
  });
}

export default dbConnect