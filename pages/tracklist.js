import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../api'
import Time from "time-passed";
import {matchSorter} from 'match-sorter'
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

  useEffect(() => {
    fetchPosts()
   }, [])
  
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

  console.log(filter.selected)

const lastPlayed = (timestamp) => {
  const timeDiff = timeago(timestamp * 1000)
  return timeDiff;
}

  return (
    <div>
      <Head>
        <title>Melotown Tracklist</title>
      </Head>

      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Melotown Tracklist</h1>
      <br />
      <div>
        <div data-freq="all" className={`${styles.filterMenu} ${filter.selected === 'all' ? styles.filterMenuActive : ""}`} onClick={handleFilterSearch}>All</div> 
        <div data-freq="889" className={`${styles.filterMenu} ${filter.selected === '889' ? styles.filterMenuActive : ""}`} onClick={handleFilterSearch}>88.9FM</div>
        <div data-freq="945" className={`${styles.filterMenu} ${filter.selected === '945' ? styles.filterMenuActive : ""}`} onClick={handleFilterSearch}>94.5FM</div>
      </div>
      <br />
      {
        filter.data.map(track => (
          <div key={track.id}>
            <a className="block border-b border-gray-300	mt-8 pb-4">
              <h2>{`${track.artist} - ${track.title}  |  ${returnRadio(track.radio_freq)}  | Last played ${lastPlayed(track.time_played)}`}</h2>
            </a>
          </div>
         )
        )
      }
    </div>
  )
}