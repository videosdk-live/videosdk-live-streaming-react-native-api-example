import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Clipboard,
  SafeAreaView,
  ToastAndroid,
  Platform,
} from 'react-native';
import Permissions, {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  requestMultiple,
  PermissionStatus,
} from 'react-native-permissions';
import {NodeCameraView} from 'react-native-nodemediaclient';
// import {_checkAndRequestCameraAndMicPermission} from '../../../common/permission/common.permission';

const UpStream = ({streamURLs, setupstreamVisible}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const {upstreamUrl, downstreamUrl} = streamURLs;

  const _checkAndRequestCameraAndMicPermission = async () => {
    const res = await requestMultiple([
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]);
    if (Platform.OS === 'android') {
      if (
        res['android.permission.CAMERA'] === 'granted' &&
        res['android.permission.RECORD_AUDIO'] === 'granted'
      ) {
        return {granted: true};
      } else {
        return {granted: false};
      }
    } else {
      if (
        res['ios.permission.CAMERA'] === 'granted' &&
        res['ios.permission.MICROPHONE'] === 'granted'
      ) {
        return {granted: true};
      } else {
        return {granted: false};
      }
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const {granted} = await _checkAndRequestCameraAndMicPermission();
    setPermissionGranted(granted);
  };

  const [isLive, setIsLive] = useState(false);
  const [visibleControls, setvisibleControls] = useState(true);

  const videoBroadcaster = useRef(null);

  const startBroadcasting = () => {
    videoBroadcaster.current && videoBroadcaster.current.start();
  };

  useEffect(() => {
    return () => {
      stopBroadcasting();
    };
  }, []);

  const stopBroadcasting = () => {
    videoBroadcaster.current && videoBroadcaster.current.stop();
  };

  const switchCamera = () => {
    videoBroadcaster.current && videoBroadcaster.current.switchCamera();
  };

  const Button = ({onPress, buttonText, backgroundColor}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
          marginVertical: 4,
          marginHorizontal: 4,
          borderRadius: 4,
        }}>
        <Text style={{color: 'white', fontSize: 12}}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {typeof permissionGranted === 'boolean' ? (
        permissionGranted ? (
          <>
            <NodeCameraView
              ref={videoBroadcaster}
              style={{
                flex: 1,
              }}
              outputUrl={upstreamUrl}
              camera={{cameraId: 1, cameraFrontMirror: true}}
              audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
              video={{
                preset: Platform.OS == 'ios' ? 1 : 4,
                bitrate: Platform.OS == 'ios' ? 600000 : 1000000,
                profile: 1,
                fps: Platform.OS == 'ios' ? 20 : 15,
                videoFrontMirror: false,
              }}
              autopreview={true}
              onStatus={(code, msg) => {
                console.log('code', code, msg);
                if (
                  Platform.OS == 'ios'
                    ? code == 2002
                    : code == 2002 || code == 2004
                ) {
                  console.log('ERRR', JSON.stringify(msg));
                }
              }}
            />
            {!isLive ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0, 0.7)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white'}}>
                  Press JOIN button to go live
                </Text>
              </View>
            ) : null}
          </>
        ) : (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: '#F6F6FF',
              paddingHorizontal: 12,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: 'bold',
                alignSelf: 'center',
              }}>
              Permission is not granted
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                backgroundColor: '#1178F8',
                marginTop: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={requestPermission}>
              <Text style={{color: 'white'}}>Request Permission</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F6F6FF',
          }}>
          <ActivityIndicator color={'blue'} />
        </View>
      )}
      {visibleControls && permissionGranted ? (
        <View
          style={{
            flexDirection: 'row',
            padding: 22,
            flexWrap: 'wrap',
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            backgroundColor: 'rgba(0,0,0, 0.8)',
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
          }}>
          <Button
            onPress={() => {
              setIsLive(true);
              startBroadcasting();
            }}
            buttonText={'JOIN'}
            backgroundColor={'#1178F8'}
          />
          <Button
            onPress={() => {
              stopBroadcasting();
              setupstreamVisible(false);
            }}
            buttonText={'LEAVE'}
            backgroundColor={'red'}
          />
          <Button
            onPress={switchCamera}
            buttonText={'TOGGLE WEBCAM'}
            backgroundColor={'#1178F8'}
          />
          <Button
            onPress={() => {
              Clipboard.setString(downstreamUrl);
              ToastAndroid.show('Link copied successfully', ToastAndroid.SHORT);
            }}
            buttonText={'COPY LINK'}
            backgroundColor={'#1178F8'}
          />
        </View>
      ) : null}
      <TouchableOpacity
        style={{
          height: 50,
          marginTop: 12,
          position: 'absolute',
          top: 2,
          left: 12,
        }}
        onPress={() => {
          setupstreamVisible(false);
        }}>
        <Text style={{color: '#1178F8'}}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UpStream;
