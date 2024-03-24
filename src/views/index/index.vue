<template xmlns="http://www.w3.org/1999/html">
  <div>
    <van-tabs v-model="active" @change="onchange">
      <van-tab title="视频">
      </van-tab>
      <van-tab title="图册">
      </van-tab>
    </van-tabs>
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" background="white" shape="round" @search="onSearch"
                show-action>
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <van-empty image="search" description="请粘贴链接再点击搜索" v-if="imageList.length<=0 && videoUrl === ''"
               style="margin-top: 20%"/>
    <div class="image-container" v-if="imageList.length>0"
         style="background-color: white;margin-top: 5px;margin-bottom: 5px">
      <div class="weibo-message">
        <div class="user-info">
          <img class="avatar" :src="specificInfo.avatar" alt="用户头像">
          <div>
            <span class="username">{{ specificInfo.username }}</span>
            <br>
            <span class="time" v-if="specificInfo.time">{{ specificInfo.time }}</span>
          </div>
        </div>
        <div class="message-content">
          <div class="title" v-if="specificInfo.title">
            {{ specificInfo.title }}
          </div>
          <div class="message-content-text" v-html="specificInfo.content">
          </div>
          <van-grid :column-num="3" square :border="false">
            <van-grid-item v-for="(item, index) in imageList" :key="index">
              <van-image :src=item fit="cover" width="110" height="110" @click="imagePreview(index)"/>
            </van-grid-item>
          </van-grid>
        </div>
      </div>


    </div>
    <van-notice-bar
        left-icon="volume-o"
        text="微博视频由于微博限制，无法播放，请点击保存视频下载到本地播放。" v-if="specificInfo!=null && specificInfo.type==='weibo' && videoUrl!==''"
    />
    <div class="video-container" v-if="videoUrl!==''"
         style="background-color: white;margin-top: 5px;margin-bottom: 5px">
      <div class="weibo-message">
        <van-row style="position: relative;">

          <van-col span="18">
            <div class="user-info">
              <img class="avatar" :src="specificInfo.avatar" alt="用户头像">
              <div>
                <span class="username">{{ specificInfo.username }}</span>
                <br>
                <span class="time" v-if="specificInfo.time">{{ specificInfo.time }}</span>
              </div>
            </div>
          </van-col>
          <van-col span="6">
            <div>
              <van-button plain type="primary" round size="small" color="#eb7350" @click="downloadVideo()" style="
              position: absolute; top: 50%; transform: translate(20%, -50%);">保存视频
              </van-button>
              <a href="" id="downloadVideoA"></a>
            </div>
          </van-col>
        </van-row>

        <div class="message-content">
          <div class="title" v-if="specificInfo.title">
            {{ specificInfo.title }}
          </div>
          <div class="message-content-text" v-html="specificInfo.content">
          </div>
          <video
              controls :src="videoUrl" :poster="specificInfo.cover" webkit-playsinline="true" playsinline="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ImagePreview} from "vant";

export default {
  data() {
    return {
      active: 0,
      list: [],
      searchValue: "",
      videoUrl: "",
      imageList: [],
      type: "",
      player: null,
      specificInfo: null
    };
  },
  created() {
  }
  ,
  components: {}
  ,
  methods: {
    onchange(index) {
      this.imageList = [];
      this.videoUrl = "";
      this.searchValue = "";
      this.type = "";
    }
    ,
    onSearch() {
      let searchType = this.active == 0 ? 'video' : 'image';
      let url = "/spider/specificInfo";
      let data = {
        data: this.searchValue,
        type: searchType
      }
      this.$axios.post(url, data).then(res => {
        if (res.code == "200") {
          this.type = res.specificInfo.type;
          this.specificInfo = res.specificInfo;
          if (this.specificInfo.content) {
            const hashedText = this.specificInfo.content.replace(/(#[^ ]+)/g, '<span style=" color: #eb7350;">$&</span>');
            this.specificInfo.content = hashedText;
          }
          if (this.active == 0) {
            this.imageList = [];
            this.videoUrl = res.specificInfo.urlList[0];
          } else if (this.active == 1) {
            this.videoUrl = "";
            this.imageList = res.specificInfo.urlList;
          }
        }
      })
    }
    ,
    imagePreview(index) {
      ImagePreview({
        images: this.imageList,
        startPosition: index
      })
    }
    ,
    downloadVideo() {
      let url = "/spider/download";
      let data = {
        data: this.videoUrl,
        type: this.type,
        itemId: this.specificInfo.itemId
      }
      this.$axios.post(url, data).then(res => {
        if (res.code === "200") {
          let a = document.getElementById("downloadVideoA");
          a.href = res.data;
          a.download = "video.mp4";
          a.click();
        }
      })
    }
  }
}
;
</script>

<style scoped>
.video-page {
  height: 100%;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 10%);
}

video {
  height: 60vh;
  width: 100vw;
  background-color: black;
  max-width: 100%;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.weibo-message {
  border-bottom: 1px solid #eee;
  padding: 15px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 50%;
}

.username {
  font-size: 15px;
  margin-right: 10px;
  font-weight: bold;
}

.time {
  font-size: 10px;
  color: #939393;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 5px;
}

.message-content {
  margin-top: 5px;
  margin-bottom: 5px;
}

.message-content-text {
  font-size: 15px;
  color: #333;
  line-height: 24px;
  pointer-events: none;
}
</style>
