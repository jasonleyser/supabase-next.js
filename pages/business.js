import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../api'

export default function RealEstate() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchPosts()
    const mySubscription = supabase
      .from('posts')
      .on('*', () => {
        console.log('something happened....')
        fetchPosts()
      })
      .subscribe()
    return () => supabase.removeSubscription(mySubscription)
  }, [])
  async function fetchPosts() {
    const { data, error } = await supabase
      .from('businesses')
      .select()
    setPosts(data)
    setLoading(false)
  }
  if (loading) return <p className="text-2xl">Loading ...</p>
  if (!posts.length) return <p className="text-2xl">No posts.</p>

  return (
    <div>
      <Head>
        <title>Melotown Real Estate</title>
      </Head>

      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Business Directory</h1>
      {
        posts.map(post => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <a className="block border-b border-gray-300	mt-8 pb-4">
              <img src="https://henricolibrary.org/images/easyblog_articles/150/b2ap3_large_9.jpg" width="300px" />
              <b>{post.name}</b>
              <p>{post.address}</p>
              <p>Owner: Jason Leyser</p>
            </a>
          </Link>)
        )
      }
    </div>
  )
}