import { Request, Response } from 'express';
import { postService } from './post.service';

const createPost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(400).json({
        error: 'Unauthenticated',
      });
    }

    const result = await postService.createPost(
      req.body,
      user.id as string
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: 'Internal Server Error',
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === 'string' ? search : undefined;
    const tags = req.query.tags
      ? (req.query.tags as string).split(',')
      : [];

    const payload: {
      search?: string;
      tags?: string[];
    } = {};

    if (searchString !== undefined) {
      payload.search = searchString;
    }

    if (tags.length > 0) {
      payload.tags = tags;
    }

    const result = await postService.getAllPost(payload);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: 'Internal Server Error',
      details: error,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
