import { Link } from 'react-router-dom';

interface BlogCardProps{
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: string
}

function BlogCard({authorName, title, content, publishedDate, id}: BlogCardProps) {
  return (
    <Link to={`/blog/${id}`}>
            <div className='border-b p-4 w-screen max-w-screen-lg'>
        <div className='flex'>
            <div className='flex flex-col justify-center'>
                <Avatar name={authorName} size='small'/>
            </div>
            <div className='font-extralight pl-2 text-sm flex flex-col justify-center'>
                {authorName}
            </div>
            <div className='flex flex-col justify-center pl-2'>
                <Circle />
            </div>
            <div className='pl-2 font-thin text-slate-500 text-sm flex flex-col justify-center'>
                {publishedDate}
            </div>
        </div>
        
        <div className='text-xl font-semibold pt-2'>
            {title}
        </div>
        <div className='text-md font-thin'>
            {content.slice(0, 150) + "..."}
        </div>
        <div className='text-sm text-slate-500 font-thin pt-4'>
            {`${Math.ceil(content.length / 100)} minute(s) read`}
        </div>
    </div>
    </Link>

  )
}

function Circle(){
    return <div className='h-1 w-1 rounded-full bg-slate-500'></div>
}

export function Avatar({name, size = "small"} : {name : string, size : "small" | "big"}){
    return   <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-200 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
    <span className={` ${size === "small" ? "text-xs" : "text-md"} text-gray-700 `}>{name[0]}</span>
</div>
}

export default BlogCard
