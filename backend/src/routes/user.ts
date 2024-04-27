import { Hono } from "hono";
import { sign } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signupInput } from "@ishhhan/medium-common";
import { signipInput } from "@ishhhan/medium-common";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) =>{
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    
    try{
      const body = await c.req.json();
      const { success } = signupInput.safeParse(body);
      if (!success){
        c.status(411)
        return c.json({
          message: "Incorrect input"
        })
      }
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name
        }
      })
      const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
      const name = user.name
      return c.json({ jwt, name });
    }catch(error){
      c.status(403);
      console.error('error in signup', error);
      return c.json({error: "error while signup"})
    }
  })
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    
    try{
      const body = await c.req.json();
      const { success } = signipInput.safeParse(body);
      if (!success){
        c.status(411)
        return c.json({
          message: "Incorrect input"
        })
      }
      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
          password: body.password
      }
    })
      const name = user?.name;
  
    if(!user){
      c.status(403);
      return c.json({error: "user not found"})
    }
    const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
      return c.json({ jwt, name });
    }
    catch(error){
      c.status(403);
      console.error('error in signin',error);
      return c.json({error: "error while signin"})
    }
    
  })

