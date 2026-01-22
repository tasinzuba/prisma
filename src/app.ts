import express, { Application } from 'express';
import { postRouter } from './modules/post/post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
const app: Application = express();

app.use(express.json());

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
}))


// 🔥 ONLY THIS — no splat, no wildcard, no app.all
app.use('/api/auth', toNodeHandler(auth));

app.use("/posts", postRouter);

app.get('/', (_req, res) => {
  res.send('Bhai Ami Kaj Kortechi');
});

export default app;

