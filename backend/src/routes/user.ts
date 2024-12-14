import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, jwt, sign, verify } from 'hono/jwt'

export const userRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string
      JWT_SECRET: string
    }
    Variables: {
      userId: string; // Add userId here
    };
}>()


userRouter.post('/signup', async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json()
  
    try {
      const user = await prisma.user.create({
        data:{
          email: body.email,
          password: body.password,
          name: body.name
        }
      })
    
      const payload = {
        id: user.id 
      }
      const token = await sign(payload,c.env.JWT_SECRET)
    
      return c.json({
        jwt: token
      })
    } catch (error) {
      return c.json({ error: "error while signing up" });
    }
  
  
  })
  
  userRouter.post('/signin', async (c) => {
    try {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
  
      const body = await c.req.json();
  
      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
          password: body.password,
        },
      });
  
      if (!user) {
        c.status(403);
        return c.json({
          error: 'User not found',
        });
      }
  
      const payload = {
        id: user.id,
      };
  
      const token = await sign(payload, c.env.JWT_SECRET);
  
      return c.json({
        token: token,
      });
    } catch (error) {
      console.error('Error during sign-in:', error); // Log error for debugging
      c.status(500); // Internal server error
      return c.json({
        error: 'An unexpected error occurred. Please try again later.',
      });
    }
  });
  
  
  
  
  