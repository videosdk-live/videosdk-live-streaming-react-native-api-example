# Video SDK live streaming react native api example

This code sample demonstrates a [Video Live Streaming API](https://docs.videosdk.live/docs/overview/live-streaming/introduction) using react native.

- Built for serverless live broadcasting experience.
- Scale it up to millions of the channels and users at the same time.
- Supports live playback
- Easy to connect with any social media live streaming API.
- Low latency across the globe.
- Design for mobile streaming experience.


## Features

- [x] RTMP support for live streaming.
- [x] Commpatible with OBS studio, Streamyard etc.
- [x] Adaptive live streaming based on screen resolution and internet bandwidth.
- [x] Record your live streaming for playback.
- [x] support for Android and IOS devices.
- [ ] Private streaming with authentication.
- [ ] Embeded live streaming player.

## Prerequisites

You must have the following installed:

- Node JS
- NPM

## Getting started

1. Run the authentication server
   Follow [videosdk-rtc-nodejs-sdk-example](https://github.com/videosdk-live/videosdk-rtc-nodejs-sdk-example) to run authentication server.

2. Clone the repo

   ```sh
   $ git clone https://github.com/videosdk-live/videosdk-live-streaming-react-native-api-example.git
   ```

3. Copy the `.env.example` file to `.env` file.

   ```sh
   $ cp .env.example .env
   ```

4. Update the api server url in the `.env` file that points to the authentication server.

   ```
   REACT_APP_SERVER_URL=http://localhost:9000
   ```

5. Install NPM packages

   ```sh
   $ npm install
   ```

6. Run the app

   ```sh
   $ npm run start
   $ npm android
   $ npm ios
   ```

For more information, visit [official documentation](https://docs.videosdk.live/docs/live-streaming/intro)
