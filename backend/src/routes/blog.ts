import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput } from "@ishhhan/medium-common";
import { updateBlogInput } from "@ishhhan/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
    Variables : {
		  userId: string
	}
}>();

blogRouter.use('/*', async (c, next) => {
	const jwt = c.req.header('authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
	const payload = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id);
	await next()
})

blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());
  
  const posts = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      author: {
        select: {
          name: true
        }
      }
    }
  });

  return c.json({posts});
})
  
  blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    
    const post = await prisma.post.findUnique({
      where: {
        id 
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });
  
    return c.json(post);
  })
  
  blogRouter.post('/', async (c) => {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
  
        const body = await c.req.json();
        const { success } = createBlogInput.safeParse(body);
        if(!success){
          c.status(411);
          return c.json({
            message: "incorrect inputs"
          })
        }
        const userId = await c.get('userId');
        const post = await prisma.post.create({
          data : {
            authorId: userId,
            title: body.title,
            content: body.content,
          }
        })
        return c.json({
          id: post.id
        })
  
})
  
  blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())

      const userId = c.get('userId');
      const body = await c.req.json();
      const {success} = updateBlogInput.safeParse(body);
      if(!success){
        c.status(411);
        return c.json({
          message: "incorrect inputs"
        })
      }
      const post = await prisma.post.update({
        where: {
          id: body.id,
          authorId: userId
        },
        data: {
          title: body.title,
          content: body.content
        }
      })
      return c.text('updated post');
  })

  blogRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
      try{
        const deleteBlog = await prisma.post.delete({
          where: {
            id
          },
        })
      }catch(e){
        return c.json({error: "error while signup"})
      }

    
  })
  
 