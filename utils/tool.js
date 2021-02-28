export async function fetchAPI(url){
  const response = await fetch(url)
  var data = await response.json()
  return data
}
