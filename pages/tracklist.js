import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../api'
import Time from "time-passed";

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
  useEffect(() => {
    fetchPosts()
   }, [])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('radio')
      .select()
      .order('created_at', { ascending: false })
    setTracks(data)
    setLoading(false)
  }
  if (loading) return <p className="text-2xl">Loading ...</p>
  if (!tracks.length) return <p className="text-2xl">No tracks.</p>

  return (
    <div>
      <Head>
        <title>Melotown Real Estate</title>
      </Head>

      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Melotown Discography</h1>
      <br />
      <p>
        <span style={{ width: 'auto', height: 'auto', backgroundColor: '#FFC363', padding: '2px 6px' }}>All</span> &nbsp;&nbsp; 88.9FM &nbsp;&nbsp; 94.5FM
      </p>
      <br />
      {
        tracks.map(track => (
          <Link key={track.id} href={`/track/${track.id}`}>
            <a className="block border-b border-gray-300	mt-8 pb-4">
              <h2>{`${track.artist} - ${track.title}  |  ${returnRadio(track.radio_freq)}`}</h2>
            </a>
          </Link>)
        )
      }
    </div>
  )
}