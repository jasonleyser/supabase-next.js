import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../api'
import { matchSorter } from 'match-sorter'

import '../styles/globals.css'
import styles from '../styles/Home.module.css';
import terminal from '../styles/Terminal.module.css';

const readable = require("readable-numbers");

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState({ query: null, data: null });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(checkUser)
    checkUser()
    return () => {
      authListener?.unsubscribe()
    };
  }, [])
  function checkUser() {
    const user = supabase.auth.user()
    setUser(user)
  }

  const handleSearch = async (query) => {
    console.log(query)
    const { data, error } = await supabase
      .from('radio')
      .select()
    return data;
  }

  const handleSearchOnChange = async (e) => {
    setSearch({ query: e.target.value })
    console.log('search', search)
    if(e.target.value === null) {
      setSearch({ query: null, data: null })
      return;
    }

    if(e.target.value === "") {
      setSearch({ query: null, data: null })
      return;
    }

    let search = await handleSearch(e.target.value)
    let filter = matchSorter(search, e.target.value, { keys: ['title', 'artist'] })
    setSearch({ query: e.target.value, data: filter })
    return;
  }

  console.log('search', search)

  return (
  <div>
    
    <nav className="p-6 border-b border-gray-300">
      <Link href="/">
        <a className="m-6">Home</a>
      </Link>
      {
        user && (
          <Link href="/create-post">
            <a className="m-6">Create Post</a>
          </Link>
        )
      }
      {
        user && (
          <Link href="/my-posts">
            <a className="m-6">My Posts</a>
          </Link>
        )
      }
      <Link href="/tracklist">
        <a className="m-6">Tracklist</a>
      </Link>

       <Link href="">
        <a className="m-6" style={{ right: '100px' }}>Σ{user && readable(user.user_metadata.score)}</a>
      </Link>

      <input onChange={handleSearchOnChange} style={{ border: '1px solid #000', paddingLeft: '5px', position: 'absolute', right: '30px', boxShadow: 'inset 0 0 1px 1px #888', outline: 'none' }} type="text" placeholder="Search Melotown (e.g. track name)" />
      
      {search.query &&
        <>
          <div className={styles.menu}>
          {search.data ?
            <>
              {search.data.map(track => (
                <div className={styles.menuItem} key={track.id}>{track.artist} - {track.title}</div>
              ))}
            </>
          :
          (<div>Loading...</div>)
          } 
          </div>
          </>
        }
      

    </nav>
    
    <div>
      <Component {...pageProps} />
    </div>
  </div>
  )
}

export default MyApp
