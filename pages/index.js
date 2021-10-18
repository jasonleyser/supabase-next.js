import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../api'
import terminal from '../styles/Terminal.module.css';

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState([])
  useEffect(() => {
    /*
    fetchPosts()
    const mySubscription = supabase
      .from('posts')
      .on('*', () => {
        console.log('something happened....')
        fetchPosts()
      })
      .subscribe()
    return () => supabase.removeSubscription(mySubscription)
    */
    const user = supabase.auth.user()
    setUserData(user)
    console.log(user)
  }, [])
  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select()
    setPosts(data)
    setLoading(false)
  }

  return (
    <div>
      <Head>
        <title>Melotown Chamber</title>
      </Head>

      {!userData ?
          <div>Not logged in</div>
        :
          <div>logged in</div>
      }

    </div>
  )
}