import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { Header, Icon, Input, Button, ListItem } from 'react-native-elements'; //2 testataan toista import käskyä

const firebaseConfig = {
  apiKey: "AIzaSyCrxcNfz4PD4fOgXXPlC6PTClTR7JOCIEU",
  authDomain: "ostoslistafirebase-6547f.firebaseapp.com",
  databaseURL: "https://ostoslistafirebase-6547f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ostoslistafirebase-6547f",
  storageBucket: "ostoslistafirebase-6547f.appspot.com",
  messagingSenderId: "70140162796",
  appId: "1:70140162796:web:e910c203182dd87bc3ebc9",
  measurementId: "G-L8K1M6BNKK"
};

export default function Ostoslista() {
  const [ostos, setOstos] = useState('');
  const [maara, setMaara] = useState('');
  const [data, setData] = useState([]);
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
 
  const saveItem = () => {
    const newItemRef = ref(database, 'data/');
    const newItem = {
      ostos: ostos,
      maara: maara
    };
    push(newItemRef, newItem);
    setOstos('');
    setMaara('');
  };
      
  useEffect(() => {
    const itemsRef = ref(database, 'data/');
    onValue(itemsRef, (snapshot) => {
      const info = snapshot.val();
      if (info) {
        const items = Object.keys(info).map((key) => ({
          id: key,
          ...info[key],
        }));
        console.log('Fetched items:', items); //data löytyy listasta
        setData(items);
      } else {
        setData([]);
      }
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }, []);
  
    const deleteItem = (id) => {
      remove(ref(database, `data/${id}`));
    };
    const renderItem = ({ item }) => ( //1 Testataan, jos erittäminen korjaa
    console.log('Fetched item:', item), // testataan, jos mitään löytyy
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.ostos}</ListItem.Title>
        <ListItem.Subtitle>
          <Icon name="delete" color="red" onPress={() => deleteItem(item.id)} />
          {item.maara}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
    return (
      <View style={styles.container}>
        <Header centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}/>
        <Input  placeholder='Product'  label='PRODUCT'  onChangeText={setOstos}  value={ostos}/>
        <Input  placeholder='Amount'  label='AMOUNT'  onChangeText={setMaara}  value={maara}/>
        <View style={styles.miniContainer}>
        <Button raised icon={{ name: 'save' }} buttonStyle={{ backgroundColor: 'lightblue' }}  title="SAVE"  onPress={saveItem}  />
        </View>
        <View style={styles.container}>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} // data ei näy ollenkaan
        />
      </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    padding: 5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniContainer: {
    width: 150,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    width: 150,
    color: 'blue',
    borderColor: 'gray',
    borderWidth: 1,
  },
});