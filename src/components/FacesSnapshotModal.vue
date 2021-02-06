<template lang="pug">
  modal(@close="close")
    template(#body)
      .full-card
        video(autoplay ref="video" v-show="!photoUrl")
        canvas(ref="canvas" v-show="photoUrl")
      .md-layout.md-alignment-center-left.mt-2
        .mr-2(v-for="(detection,index) in detections" )
          canvas.face-cropped(:ref="'face-'+index" v-if="!faces.length")
          img.face-cropped(:src="faces[index].url" v-else :class="{disabled:!faces[index].selected}" @click="toggleSelectFace(index)")
    template(#footer)
      md-button.pull-right.md-rose(@click="snapshot" v-if="!photoUrl") 拍摄
      md-button.pull-right.md-rose(@click="resetSnapshot" v-else) 重拍
      md-button.pull-right.md-primary.ml-2() 保存
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Modal from "./Modal.vue";
import {
  loadSsdMobilenetv1Model,
  detectAllFaces,
  FaceDetection
} from "face-api.js";

@Component({
  components: {
    Modal
  }
})
export default class FacesSnapshotModal extends Vue {
  stream?: MediaStream;
  modelLoaded = false;
  photoUrl: string | null = null;
  photoFile: File | null = null;
  detections: FaceDetection[] = [];
  faces: { url: string; file?: File; selected: boolean }[] = [];

  async loadModels() {
    await loadSsdMobilenetv1Model("https://cdn.mini-mars.com/face-models/");
    this.modelLoaded = true;
  }

  async snapshot() {
    const video = this.$refs.video as HTMLVideoElement;
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    if (this.photoUrl) {
      this.photoUrl = null;
      this.photoFile = null;
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);

    this.stopStream();

    this.photoUrl = canvas.toDataURL("image/jpeg");
    // canvas.toBlob(blob => {
    //   if (!blob) return;
    //   const file = new File([blob], `test.png`);
    //   this.photoFile = file;
    //   console.log("photoFile", file);
    // });
    this.detectFaces(canvas);
  }

  async detectFaces(canvas: HTMLCanvasElement) {
    this.detections = await detectAllFaces(canvas);
    await this.$nextTick();
    this.detections.forEach((d, i) => {
      const refs = this.$refs["face-" + i] as Element[];
      const faceCanvas = refs[0] as HTMLCanvasElement;
      faceCanvas.width = d.box.width;
      faceCanvas.height = d.box.height;
      faceCanvas
        .getContext("2d")
        ?.drawImage(
          canvas,
          d.box.x,
          d.box.y,
          d.box.width,
          d.box.height,
          0,
          0,
          faceCanvas.width,
          faceCanvas.height
        );
      const url = faceCanvas.toDataURL("image/jpeg");
      // faceCanvas.toBlob(blob => {
      //   if (!blob) return;
      //   const file = new File([blob], `test.png`);
      //   this.faces.push({url,file,selected:true});
      // });
      this.faces.push({ url, selected: true });
      // this.photoUrl = canvas.toDataURL("image/png");
    });
  }

  toggleSelectFace(index: number) {
    this.$set(this.faces, index, {
      ...this.faces[index],
      selected: !this.faces[index].selected
    });
  }

  resetSnapshot() {
    this.photoFile = null;
    this.photoUrl = null;
    this.faces = [];
    this.startStream();
  }

  close() {
    this.$emit("close");
  }

  startStream() {
    const video = this.$refs.video as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        this.stream = stream;
        (video as HTMLVideoElement).srcObject = stream;
      })
      .catch(e => {
        console.log(`navigator.getUserMedia error: ${e}`);
      });
  }

  stopStream() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  mounted() {
    this.startStream();
    this.loadModels();
  }
}
</script>

<style lang="scss" scoped>
.full-card {
  margin-left: -24px;
  margin-top: -48px;
  margin-right: -24px;
  height: 281.25px;
  video,
  canvas {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px 6px 0 0;
  }
}
.face-cropped {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  &.disabled {
    opacity: 0.4;
  }
}
</style>