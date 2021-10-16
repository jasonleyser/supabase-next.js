// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from '../../../api'

async function submitData(props) {	
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
			radio_id: props.radio_id, 
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
		radio_id: play[4], 
		discogs_id: play[5], 
		discogs_url: play[6] 
	});

	res.end(`Post: ${play}`)
}

