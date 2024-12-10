import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// routes needed

app.post('/signup',(c)=>{
  return c.text("signup page")
})


app.post('/signin',(c)=>{
  return c.text("signin page")
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
