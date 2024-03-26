import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	}
}>();

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.use('/api/v1/blog/*', async (c, next) => {
  try{
    const header = await c.req.header("authorization") || "";
    const token = header.split(" ")[1]
    const response = await verify(token, c.env.JWT_SECRET)
    if(response.id){
      next()
    }else{
      c.status(403)
      return c.json({error: "unauthorized"})
    }
  }catch(error){
    c.status(403);
    console.error('error in middleware: ', error);
    return c.json({error: "error in middleware"})
  }
})



app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  console.log(id);
  return c.text('get blog route')
})

app.post('/api/v1/blog', (c) => {
  return c.text('signin route')
})

app.put('/api/v1/blog', (c) => {
  return c.text('signin route')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('blogs')
})
export default app
