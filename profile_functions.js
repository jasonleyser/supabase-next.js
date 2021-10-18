import { supabase } from './api'

export const UseScore = async (props) => {
  console.log('adding score')
  let newScore = props.score - props.amount;
  const { user, error } = await supabase.auth.update({ 
    data: { score: newScore } 
  })
  return user;
}