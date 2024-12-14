import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'



const app = new Hono<{
    Bindings:{
      DATABASE_URL: string
      JWT_SECRET: string
    }
    Variables: {
      userId: string; // Add userId here
    };
}>()



app.get('/', (c) => {
  return c.text('Hello Hono!')
})



// routes needed for user
app.route("/user", userRouter)



app.use('/blog/*' ,async (c, next) => {
  const header = c.req.header("authorisation") || ""

  const response = await verify(header, c.env.JWT_SECRET)
  if (response.id){

    c.set('jwtPayload', { userId: response.id });

    next()
  } else{
    c.status(403)
    return c.json({
      error: "unauthorized"
    })
  } 
})

app.post('/blog',(c)=>{
  return c.text("create blog")
})


app.put('/blog',(c)=>{
  return c.text("edit blogs")
})


app.get('/blog/:id',(c)=>{
  return c.text("get a particular blog")
})


app.get('/blogs',(c)=>{
 return c.text("all blogs")
})
 

app.get('/my-blogs',(c)=>{
 return c.text("all blogs of a user")
})



export default app
