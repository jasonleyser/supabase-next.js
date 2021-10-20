import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../api'

import * as Profile from '../profile_functions'

import Time from "time-passed";
import { matchSorter } from 'match-sorter'
import styles from '../styles/Home.module.css';
import timeago from 'epoch-timeago';

const returnRadio = (frequency) => {
  if(frequency === '889') {
    return '89.9FM Old School Hip-Hop Radio'
  } else if (frequency === '945') {
    return '94.5FM Boom Bap Instrumental Radio'
  }
}

export default function RealEstate() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ query: "", selected: 'all', data: null })
  const [user, setUser] = useState([])

  useEffect(() => {
    fetchPosts()
    setUser(supabase.auth.user());

    //let timer = setInterval(fetchPosts(), 6000);
    //console.log('timer', timer)
   }, [])

  const handleClickAdd = () => {
    Profile.UseScore({ 
      score: user.user_metadata.score,
      amount: 1,
    });
    let num = user.user_metadata.score - 1
    //setUser({user.user_metadata.score: num})
    return;
  }

  console.log('user::', user)
  
  async function fetchPosts() {
    const { data, error } = await supabase
      .from('radio')
      .select()
      .order('created_at', { ascending: false })
      .limit(50)

    setTracks(data)
    setFilter({ data: data, selected: 'all' })
    setLoading(false)
  }

  const handleFilterSearch = (e) => {
    //setFilter({ selected: e.target.dataset.freq })
    if(e.target.dataset.freq === "all") {
      setFilter({ query: "", selected: "all", data: tracks })
      return;
    }
    let filter = matchSorter(tracks, e.target.dataset.freq, { keys: ['radio_freq'] })
    setFilter({ query: "", selected: e.target.dataset.freq, data: filter })
    return;
  }

  if (loading) return <p className="text-2xl">Loading ...</p>
  if (!tracks.length) return <p className="text-2xl">No tracks.</p>

  const lastPlayed = (timestamp) => {
    const timeDiff = timeago(timestamp * 1000)
    return timeDiff;
  }

  const handleOpenYoutube = (props) => {
    console.log('track', props)
    let str = `${props.artist} - ${props.title} ${props.year}`;
    let urlQuery = str.replace(/\s+/g, '+').toLowerCase();
    window.open(`https://www.youtube.com/results?search_query=${urlQuery}`, "_blank")
  }

  return (
    <div>
      <Head>
        <title>Melotown Tracklist</title>
      </Head>

      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Melotown Lineup</h1>

      <div>
        <div data-freq="all" className={`${styles.filterMenu} ${filter.selected === 'all' ? styles.filterMenuActive : ""}`} onClick={handleFilterSearch}>All</div> 
        <div data-freq="889" className={`${styles.filterMenu} ${filter.selected === '889' ? styles.filterMenuActive : ""}`} onClick={handleFilterSearch}>88.9FM</div>
        <div data-freq="945" className={`${styles.filterMenu} ${filter.selected === '945' ? styles.filterMenuActive : ""}`} onClick={handleFilterSearch}>94.5FM</div>
        <div data-freq="1061" className={`${styles.filterMenu} ${filter.selected === '1061' ? styles.filterMenuActive : ""}`} onClick={handleFilterSearch}>106.1FM</div>
      </div>
      <br />
      {
        filter.data.map(track => {
          let button = "🔥";
          return(
            <div key={track.id} className={styles.trackCard} onClick={() => handleOpenYoutube(track)}>
              <div className="block border-b border-gray-300  mt-8 pb-4">
                <h1>{`${track.artist} - ${track.title}  | Last played ${lastPlayed(track.time_played)}`}</h1>
                <p>{returnRadio(track.radio_freq)}</p>
              </div>
              {user &&
                <>
                  <button onClick={handleClickAdd}>{button}</button>
                </>
              }
            </div>
           )}
        )
      }
    </div>
  )
}