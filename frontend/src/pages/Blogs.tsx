
import BlogCard from '../components/BlogCard'
import Appbar from '../components/Appbar'
import { useBlogs } from '../hooks'

function Blogs() {
  const {loading, blogs} = useBlogs();

  if(loading){
    return(
      <div>Loading...</div>
    )
  }
  return (
    <div>
      <Appbar/>
    <div className='flex justify-center'>
      <div>
        {blogs.map(blog => 
          <BlogCard
          id={blog.id}
          authorName={blog.author.name || "Anonymous"}
          title= {blog.title}
          content={blog.content}
          publishedDate={'21-04-2023'}
        />
        )}
      
      </div>
      
    </div>
  </div>
  )
}

export default Blogs