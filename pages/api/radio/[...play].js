// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from '@supabase/supabase-js'

async function submitData(props) {	
	const supabase = createClient(
		'https://pnkzceroksigqqmtsaja.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjc0OTM5NywiZXhwIjoxOTQyMzI1Mzk3fQ.X_Ga_qrcpq67GDaZt4th9QmVJreARB2jS1mypy7nJ4A'
	)

	//let main = decodeURIComponent(props.url)
	//console.log('main', main)

	const { data, error } = await supabase
		.from('radio')
		.insert([
		{ 
			title: props.title, 
			artist: props.artist, 
			year: props.year, 
			underground_lvl: props.underground_lvl,
			discogs_id: props.discogs_id, 
			discogs_url: props.discogs_url 
		},
	])

	return data;
}

export default (req, res) => {
	//console.log('req', req)
	const { play } = req.query
	submitData({ 
		title: play[0], 
		artist: play[1], 
		year: play[2], 
		underground_lvl: play[3], 
		discogs_id: play[4], 
		discogs_url: play[5] 
	});

	res.end(`Post: ${play}`)
}

