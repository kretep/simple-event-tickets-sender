// Put dotenv.config() call in separate module, as ESM imports are hoisted
// and we need the dotenv.config() before importing any other modules...
import dotenv from 'dotenv';
dotenv.config();
