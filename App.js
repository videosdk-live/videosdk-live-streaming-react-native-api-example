import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import UpStream from "./src/UpStream";
import { REACT_APP_VIDEOSDK_URL, REACT_APP_SERVER_URL } from "@env";
import PlayBackStream from "./src/PlayBackStream";

export default function App() {
  const [streamURLs, setstreamURLs] = useState({
    upstreamUrl: "",
    playbackHlsUrl: "",
  });
  const [upstreamVisible, setupstreamVisible] = useState(false);
  const [playbackstreamVisible, setplaybackstreamVisible] = useState(false);

  const getToken = async () => {
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/get-token`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const { token } = await response.json();
      return token;
    } catch (e) {
      console.log(e);
    }
  };

  const getStreamURLs = async (token) => {
    const API_URL = `${REACT_APP_VIDEOSDK_URL}/v1/livestreams`;
    const data = {
      record: true,
      name: "videosdk",
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(API_URL, options);
      const jsonResp = await response.json();
      return jsonResp;
    } catch (e) {
      console.log(e);
    }
  };

  const callApis = async () => {
    const token = await getToken();
    const urlS = await getStreamURLs(token);
    setstreamURLs({
      playbackHlsUrl: urlS?.playbackHlsUrl,
      upstreamUrl: urlS?.upstreamUrl,
    });
  };

  useEffect(() => {
    callApis();
  }, []);

  const Home = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (playbackstreamVisible) {
              setplaybackstreamVisible(false);
            }
            setupstreamVisible(true);
          }}
          style={{
            borderRadius: 8,
            padding: 16,
            backgroundColor: "#4AA96C",
            marginVertical: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Go Live</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (upstreamVisible) {
              setupstreamVisible(false);
            }
            setplaybackstreamVisible(true);
          }}
          style={{
            borderRadius: 8,
            padding: 16,
            backgroundColor: "#F55C47",
            marginVertical: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Down Stream</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6F6FF",
      }}
    >
      {upstreamVisible ? (
        <UpStream
          streamURLs={streamURLs}
          setupstreamVisible={setupstreamVisible}
        />
      ) : playbackstreamVisible ? (
        <PlayBackStream setplaybackstreamVisible={setplaybackstreamVisible} />
      ) : (
        <Home />
      )}
    </View>
  );
}
