export const borders = 0;

const list = {
  bold:{fontWeight:"bold"},
  fs:(num)=>({fontSize:num}),
  m:(num)=>({margin:num}),
  mt:(num)=>({marginTop:num}),
  mb:(num)=>({marginBottom:num}),
  ml:(num)=>({marginLeft:num}),
  mr:(num)=>({marginRight:num}),
}
export const createStyle = (styles = []) => {
  let returnStyle = {}
  styles.forEach((item)=>{
    returnStyle = {...returnStyle,...list[item]}
  })
  return returnStyle;
}
