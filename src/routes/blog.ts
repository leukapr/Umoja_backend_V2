import express from 'express';
import {
  createBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogs,
  updateBlog,
} from '../controllers/blog.js';

const router = express.Router();

/**
 * @route   POST /api/blogs
 * @desc    Créer un nouvel article
 */
router.post('/', createBlog);

/**
 * @route   GET /api/blogs
 * @desc    Récupérer tous les articles
 */
router.get('/', getBlogs);

/**
 * @route   GET /api/blogs/:slug
 * @desc    Récupérer un article par son slug
 */
router.get('/:slug', getBlogBySlug);

/**
 * @route   PUT /api/blogs/:id
 * @desc    Mettre à jour un article
 */
router.put('/:id', updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Supprimer un article
 */
router.delete('/:id', deleteBlog);

export default router;
