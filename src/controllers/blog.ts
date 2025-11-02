import { Request, Response } from 'express';
import Blog from '../models/blog.js';

/**
 * 🟢 Créer un nouvel article de blog
 * POST /api/blogs
 */
export async function createBlog(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { title, slug, content, author, published } = req.body;

    if (!title || !slug || !content || !author) {
      return res
        .status(400)
        .json({ error: 'Tous les champs requis doivent être remplis.' });
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      author,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
    });

    return res.status(201).json(blog);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * 🟡 Récupérer tous les articles de blog
 * GET /api/blogs
 */
export async function getBlogs(
  _req: Request,
  res: Response,
): Promise<Response> {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.json(blogs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * 🟣 Récupérer un article par son slug
 * GET /api/blogs/:slug
 */
export async function getBlogBySlug(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ where: { slug } });

    if (!blog) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }

    return res.json(blog);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * 🔵 Mettre à jour un article
 * PUT /api/blogs/:id
 */
export async function updateBlog(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const { title, slug, content, author, published } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }

    // Si on publie pour la première fois → ajoute la date de publication
    if (published && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.update({
      title,
      slug,
      content,
      author,
      published,
      publishedAt: blog.publishedAt,
    });

    return res.json(blog);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * 🔴 Supprimer un article
 * DELETE /api/blogs/:id
 */
export async function deleteBlog(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }

    await blog.destroy();
    return res.json({ message: `Article "${blog.title}" supprimé.` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
