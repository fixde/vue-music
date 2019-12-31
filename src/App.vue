<template>
  <div id="app">
    <input type="checkbox" id="menu" v-model="menu">
    <div class="coverImage"></div>
    <div class="bodyPlayer"></div>
    <table class="list">
      <tr class="song" v-for="(item, index) of music" :key="index" :class="{'active': index === current}" @click="run(index)">
        <td>{{ index + 1 }}</td>
        <td class="title">{{ item  | title }}</td>
      </tr>
    </table>
    <div class="shadow"></div>
    <progress class="bar" @click="goTo($event)" max="100" :value="progress"></progress>
    <h4 class="info">{{ music[current] | title }}</h4>
    <table class="player">
      <td>
        <fa class="control" icon="backward" @click="run(current - 1)"></fa>
      </td>
      <td>
        <fa v-if="audio" class="control" :icon="audio.paused ? 'play' : 'stop'" @click="audio.paused ? audio.play() : audio.pause()"></fa>
      </td>
      <td>
        <fa class="control" icon="forward" @click="run(current + 1)"></fa>
      </td>
    </table>
    <table class="footer">
      <td>
        <input type="checkbox">
        <fa class="control" icon="undo" @click="run(current)"></fa>
      </td>
      <td>
        <input type="checkbox" v-model="shuffle">
        <fa :class="{'control': true, 'checked': shuffle}" icon="random" @click="shuffle = !shuffle"></fa>
      </td>
      <td>
        <input type="checkbox" v-model="repeat">
        <fa :class="{'control': true, 'checked': repeat}" icon="retweet" @click="repeat = !repeat"></fa>
      </td>
      <td>
        <input type="checkbox">
        <fa class="control" icon="bars" @click="menu = !menu"></fa>
      </td>
    </table>
    <div class="current">
      <fa class="control" icon="bars" @click="menu = !menu"></fa>
    </div>
    <audio id="audio" preload="auto" controls @ended="repeat ? run(current, true) : run(current + 1, true)" @timeupdate="timeupdate()" ref="audio"></audio>
  </div>
</template>

<script>

export default {
  name: 'App',

  data () {
    return {
      music: [],
      current: 0,
      progress: 0,
      repeat: false,
      shuffle: false,
      menu: false,
      audio: {}
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.music = Object.keys(process.env)
        .filter(key => key.includes('VUE_APP_MUSIC'))
        .map(key => decodeURIComponent(process.env[key]))
      this.audio = this.$refs.audio
      this.run(this.current)
    })
  },

  methods: {
    run (index, auto = false) {
      if (this.shuffle && auto) {
        index = Math.floor(Math.random() * (this.music.length - 1))
      }
      if (index >= this.music.length) {
        index = 0
      }
      if (index < 0) {
        index = this.music.length - 1
      }
      this.current = index
      this.audio.src = this.music[index]
      this.audio.load()
      this.audio.play()
    },

    goTo (e) {
      this.audio.currentTime = this.audio.duration * e.offsetX / e.currentTarget.offsetWidth
      this.timeupdate()
    },

    timeupdate () {
      let progress = 100 * this.audio.currentTime / this.audio.duration
      if (!isNaN(progress)) {
        this.progress = progress
      }
    }
  },

  filters: {
      title(value) {
        return value ? value.replace('.mp3', '').split('/').slice(-1).join('') : '';
      },
  },
}
</script>

<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);

body {
  background: url('./assets/main.jpg') no-repeat center center;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  -ms-background-size: cover;
  background-size: cover;
}

audio {
  visibility: hidden;
}

input[type=checkbox] {
  visibility: hidden;
  margin: 0;
  padding: 0;
  z-index: 10;
}

#app {
  background-color: #000;
  padding: 0;
  height: 650px;
  width: 366px;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  margin: 30px 0;
}

.header {
  display: inline-flex;
  margin: 0 0 40px 0;
}

.coverImage {
  background: url('./assets/cover.jpg') no-repeat;
  background-size: cover;
  width: 100%;
  height: 366px;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0% 0%;
  transition: all 0.3s ease-in;
}

#menu:checked ~ .coverImage {
  transform: scale(0.251, 0.251);
  left: 23px;
  top: 60px;
  transition: all 0.3s ease-in;
  border-radius: 20px;
}

.bodyPlayer {
  position: absolute;
  top: 366px;
  left: 0;
  margin: 0;
  padding: 0;
  height: 286px;
  width: 100%;
  background: #111;
  transition: all 0.3s ease-in;
}

#menu:checked ~ .bodyPlayer {
  height: 470px;
  left: 0;
  top: 180px;
  transition: all 0.3s ease-in;
}

.list {
  border-spacing: 0px 2px;
  width: 342px;
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 378px;
  left: 12px;
  transform-origin: 0% 0%;
  transform: scale(0.1, 0.1);
  transition: all 0.3s ease-in;
  font-size: 13px;
  line-height: 13px;
  font-family: 'Open Sans';
  font-weight: 700;
  tr {
    transform-origin: 0% 50%;
    height: 50px;
    text-align: center;
    background: #1d1d1d;
    text-indent: 8px;
    color: #777;
    text-align: left;
    &:hover, &.active {
      background: #222;
      cursor: pointer;
      transition: all 0.11s ease-in;
      color: #fff;
    }
  }
}

#menu:checked ~ {
  .list {
    top: 192px;
    left: 12px;
    opacity: 1;
    visibility: visible;
    transform: scale(1, 1);
    transition: all 0.3s ease-in;
  }
  table tr {
    opacity: 1;
    animation-delay: 0.3s;
  }
}

.bar {
  background-color: #5E5E5E;
  background-repeat: no-repeat;
  background-size: 100%;
  width: 320px;
  height: 5px;
  position: absolute;
  top: 407px;
  left: 23px;
  transform-origin: 0% 0%;
  transition: all 0.3s ease-in;
  cursor: pointer;
}

#menu:checked ~ .bar {
  top: 119px;
  left: 126px;
  transform: scale(0.6875, 0.6875);
  transition: all 0.3s ease-in;
}

.info {
  width: 157px;
  position: absolute;
  left: 104px;
  top: 440px;
  transition: all 0.3s ease-in;
  text-align: center;
  margin-bottom: 5px;
  margin-top: 0;
  padding: 0;
  font-size: 14px;
  line-height: 14px;
  font-family: 'Open Sans';
  font-weight: 700;
  color: #fff;
}

#menu:checked ~ .info {
  top: 66px;
  left: 126px;
  text-align: left;
  transition: all 0.3s ease-in;
  h4 {
    margin-left: 0;
    font-size: 16px;
    color: #111111;
    transition: all 0.3s ease-in;
  }
}

.player {
  background: none;
  text-align: center;
  font-family: FontAwesome;
  color: #fff;
  font-size: 26px;
  line-height: 26px;
  width: 216px;
  height: 35px;
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 10;
  transition: all 0.3s ease-in;
  border-spacing: 0;
  td {
    width: 72px;
  }
}

.control {
  cursor: pointer;
  transition: all 0.15s linear;
  font-style: normal;
  &:hover {
    color: #bbb;
    transition: all 0.15s linear;
  }
}

.checked {
  color: #ff564c;
  transition: all 0.15s linear;
}

#menu:checked ~ .player {
  bottom: 4px;
  left: -44px;
  transform: scale(0.45, 0.45);
  transition: all 0.3s ease-in;
}

.shadow {
  background: rgba(17, 17, 17, 0.8);
  width: 366px;
  height: 50px;
  position: absolute;
  bottom: -12px;
  left: 0;
  box-shadow: 0px -15px 40px rgba(17, 17, 17, 0.8);
}

.footer {
  background: none;
  color: #6d6d6d;
  font-size: 15px;
  line-height: 15px;
  height: 45px;
  width: 360px;
  position: absolute;
  bottom: 10px;
  left: 23px;
  z-index: 20;
  transition: all 0.15s linear;
  transition: bottom 0.3s linear;
}

#menu:checked ~ .footer {
  bottom: -60px;
  transition: all 0.3s ease-in;
}

.current {
  position: absolute;
  right: 23px;
  bottom: -60px;
  transition: all 0.3s ease-in;
  color: #fff;
}

#menu:checked ~ .current {
  bottom: 15px;
  transition: all 0.3s ease-in;
}
</style>
