import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';



export default function Ostoslista() {
  const [ostos, setOstos] = useState('');
  const [maara, setMaara] = useState('');
  const [data, setData] = useState([]);
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
        setData(items);
      } else {
        setData([]);
      }
    });
  }, []);
  
    const deleteItem = (id) => {
      remove(ref(database, `data/${id}`));
    };
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <TextInput style={styles.input} onChangeText={setOstos} value={ostos} placeholder="Item"/>
        <TextInput style={styles.input} onChangeText={setMaara} value={maara} placeholder="Quantity"/>
        <View style={styles.miniContainer}>
        <Button title="Add" onPress={saveItem} />
        </View>
        <View style={styles.container}>
          <Text>Shopping list</Text>
          <FlatList data={data} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
              <View style={styles.miniContainer}>
              <Text>{item.ostos}, {item.maara}</Text>
              <Text style={{ color: '#0000ff' }} onPress={() => deleteItem(item.id)}> bought </Text>
              </View> )}/>
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