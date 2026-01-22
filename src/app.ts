import express, { Application } from 'express';
import { postRouter } from './modules/post/post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";

const app: Application = express();

app.use(express.json());

// 🔥 ONLY THIS — no splat, no wildcard, no app.all
app.use('/api/auth', toNodeHandler(auth));

app.use("/posts", postRouter);

app.get('/', (_req, res) => {
  res.send('Bhai Ami Kaj Kortechi');
});

export default app;

