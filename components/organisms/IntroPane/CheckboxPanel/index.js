import React, {useState} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import style from "./style";

const CheckboxPanel = ({list = [],column = 2, single = false, fontSize = undefined }) => {
  let [checkedList,setCheckedList] = useState([]);

  const RenderItem = ({value = "",checked = false, onChange}) => {
    //let [state,setState] = useState({checked:checked});
    return <TouchableOpacity
      style={style.checkboxItem}
      onPress={()=> {
        onChange();
        //setState(prev=>({...prev,checked: !prev.checked}))
      }}
    >
      <View style={style.itemLeft}>
        <Text style={{...style.itemText, fontSize}}>{value}</Text>
      </View>
      <View style={{width:20,borderWidth:0}}>
        {checked ?
          <Image style={style.itemCheckbox} source={require('../../../../img/assets/intro/checked.png')} />
          :
          null
          //<View style={style.itemCheckbox}/>
        }
      </View>
    </TouchableOpacity>
  }

  let result = '';

  let rows = [];
  let columns = [];

  const isEven = (value) => value % column === 0;

  list.map((listItem,listItemIndex)=>{
    columns.push(<RenderItem
      key={listItemIndex}
      name={"checkbox_"+listItemIndex}
      value={listItem}
      checked={checkedList[listItemIndex]}
      onChange={()=>{
        let newItems = checkedList;
        if(single){
          newItems.map((item,index)=> {
            if(index !== listItemIndex) newItems[index] = false;
          });
        }
        newItems[listItemIndex] = !newItems[listItemIndex];
        setCheckedList([...newItems]);
      }}
    />);
    if(!isEven(listItemIndex)){
      rows.push(<View style={style.row} key={listItemIndex}>{columns}</View>)
      columns = [];
    }
  });

  result = <View style={style.container}>{rows}</View>

  return result;
}
 export default CheckboxPanel;
