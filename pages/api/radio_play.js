// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from '@supabase/supabase-js'

async function submitData() {	
	console.log('starting')

	const supabase = createClient(
		'https://pnkzceroksigqqmtsaja.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjc0OTM5NywiZXhwIjoxOTQyMzI1Mzk3fQ.X_Ga_qrcpq67GDaZt4th9QmVJreARB2jS1mypy7nJ4A'
	)

	const { data, error } = await supabase
		.from('radio')
		.insert([
		{ artist: 'hello', title: 'otherValue' },
	])
	console.log('finished')
	return data;
}

export default (req, res) => {
	//console.log('req', req)
	const { pid } = req.query
	submitData();
	res.end(`Post: ${pid}`)
}

