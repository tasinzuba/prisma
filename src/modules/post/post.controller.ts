import { Request, response, Response } from 'express';
import { postService } from './post.service';

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
             return res.status(400).json({ 
                error: "Unauthenticated",
            });
        
        }
        const result = await postService.createPost(req.body, user.id as string);
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({ 
            error: "Internal Server Error",
            details: error });
    }

}

const getAllPost = async (req: Request, res: Response) => {
try {
    const {search} = req.query
    const searchString = typeof search === 'string' ? search : undefined;
    const result = await postService.getAllPost({search: searchString});
    res.status(200).json(result);
} catch (error) {
    res.status(400).json({ 
        error: "Internal Server Error",
        details: error });
}}

export const postController = {
    createPost,
    getAllPost,
};