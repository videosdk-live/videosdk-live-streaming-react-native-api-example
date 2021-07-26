import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';

export default function DownStream({setdownstreamVisible}) {
  const [URL, setUrl] = useState('');
  const [visible, setvisible] = useState(false);
  const player = useRef();

  return (
    <View
      style={{
        flex: 1,
      }}>
      {visible ? (
        <Video
          ref={player}
          style={{flex: 1, backgroundColor: 'black'}}
          onError={e => {
            console.log('EE', e);
          }}
          onLoad={() => {}}
          resizeMode={'contain'}
          source={{
            uri: URL,
          }}
        />
      ) : (
        <View
          style={{
            backgroundColor: 'grey',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16}}>Paste Live Stream URL</Text>
        </View>
      )}
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TextInput
          value={URL}
          placeholder={'http://www.example.com/live/playlist.m3u8'}
          style={{color: 'black', marginLeft: 12, width: '80%'}}
          numberOfLines={2}
          onChangeText={setUrl}
          selectionColor={'#1178F8'}
          placeholderTextColor={'#9FA0A7'}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {URL ? (
            <TouchableOpacity
              onPress={() => {
                setUrl(URL);
                setvisible(true);
              }}
              style={{
                backgroundColor: '#1178F8',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 12,
                marginVertical: 4,
                marginHorizontal: 4,
                borderRadius: 4,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Play</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: 50,
          marginTop: 12,
          position: 'absolute',
          top: 2,
          left: 12,
        }}
        onPress={() => {
          setdownstreamVisible(false);
        }}>
        <Text style={{color: '#1178F8'}}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
