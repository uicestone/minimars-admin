<template lang="pug">
  modal(@close="close")
    template(#body)
      .full-card
        video(autoplay ref="video" v-show="state==='capture'")
        canvas(ref="canvas" v-show="state==='preview'")
        //- img(:src="photoPreviewUrl" v-show="state==='preview'")
        slider(v-show="state==='view'" height="100%")
          slider-item(v-for="photo in booking.photos" :key="photo")
            img(:src="photo")
      md-progress-bar(v-if="detecting" md-mode="indeterminate")
      .md-layout.md-alignment-center-left.mt-2(v-if="state==='preview'")
        .mr-2(v-for="(detection,index) in detections" )
          canvas.face-cropped(:ref="'face-'+index" v-if="!faces.length")
          img.face-cropped(:src="faces[index].url" v-else :class="{disabled:!faces[index].selected}" @click="toggleSelectFace(index)")
        .alert.alert-warning.mt-2(v-if="booking.faces.length+selectedFaces.length > booking.kidsCount+booking.adultsCount" style="width:100%;padding:7px") 人脸数量大于订单人数，请点击不需要的人脸取消
      .md-layout.md-alignment-center-left.mt-2(v-if="state==='view'")
        .mr-2(v-for="(faceUrl,index) in booking.faces")
          img.face-cropped(:src="faceUrl")
    template(#footer)
      md-button.md-just-icon.md-simple.md-rose.float-left(v-if="cameras.length>1" @click="switchCamera")
        md-icon cameraswitch
      md-button.pull-right.md-danger.md-simple(@click="close") 关闭
      md-button.pull-right.md-rose(@click="snapshot" v-if="state==='capture'") 拍摄
      md-button.pull-right.md-rose(@click="resetSnapshot" v-if="state==='preview'") 重拍
      md-button.pull-right.md-success(@click="resetSnapshot" v-if="state==='view' && booking.faces.length < booking.kidsCount+booking.adultsCount") 加拍
      md-button.pull-right.md-primary.ml-2(@click="save" v-if="state==='preview' && selectedFaces.length") 保存
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Slider, SliderItem } from "vue-easy-slider";
import Modal from "./Modal.vue";
import {
  loadSsdMobilenetv1Model,
  detectAllFaces,
  FaceDetection
} from "face-api.js";
import { http } from "@/resources";
import { File as FileDoc, Booking } from "@/resources/interfaces";

@Component({
  components: {
    Modal,
    Slider,
    SliderItem
  }
})
export default class FacesSnapshotModal extends Vue {
  stream?: MediaStream;
  modelLoaded = false;
  detecting = false;
  cameras: MediaDeviceInfo[] = [];
  selectedCamera: MediaDeviceInfo | null = null;
  photoPreviewUrl: string | null = null;
  photoFile: File | null = null;
  detections: FaceDetection[] = [];
  faces: { url: string; file?: File; selected: boolean }[] = [];
  state: "capture" | "preview" | "view" = "view";

  @Prop({ required: true })
  booking!: Booking;

  get selectedFaces() {
    return this.faces.filter(face => face.selected);
  }

  @Watch("state") onStateChange() {
    console.log("state:", this.state);
    if (this.state === "capture") {
      this.startStream();
    } else {
      this.stopStream();
    }
  }

  async loadModels() {
    await loadSsdMobilenetv1Model("https://cdn.mini-mars.com/face-models/");
    this.modelLoaded = true;
    console.log("Model loaded.");
  }

  switchCamera() {
    const index = this.cameras.findIndex(
      c => c.deviceId === this.selectedCamera?.deviceId
    );
    if (index < this.cameras.length) {
      this.selectedCamera = this.cameras[index + 1];
    } else {
      this.selectedCamera = null;
    }
    console.log("selected:", this.selectedCamera?.label);
    if (this.selectedCamera) {
      window.localStorage.setItem(
        "selectedCameraDeviceId",
        this.selectedCamera.deviceId
      );
    } else {
      window.localStorage.removeItem("selectedCameraDeviceId");
    }
    if (this.state === "capture") {
      this.stopStream();
      this.startStream();
    }
  }

  async snapshot() {
    const video = this.$refs.video as HTMLVideoElement;
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    if (this.photoPreviewUrl) {
      this.photoPreviewUrl = null;
      this.photoFile = null;
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);

    console.log("image drew");

    this.photoPreviewUrl = canvas.toDataURL("image/jpeg");
    canvas.toBlob(
      blob => {
        if (!blob) return;
        const file = new File([blob], `photo-${Date.now()}.jpg`);
        this.photoFile = file;
      },
      "image/jpeg",
      0.6
    );
    this.state = "preview";
    setTimeout(() => {
      this.detectFaces(canvas);
    });
  }

  async detectFaces(canvas: HTMLCanvasElement) {
    this.detecting = true;
    this.detections = await detectAllFaces(canvas);
    await this.$nextTick();
    this.detecting = false;
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
      this.faces.push({ url, selected: true });
      faceCanvas.toBlob(blob => {
        if (!blob) return;
        const file = new File([blob], `face-${Date.now()}.jpg`);
        this.faces[i].file = file;
      }, "image/jpeg");
    });
  }

  toggleSelectFace(index: number) {
    this.$set(this.faces, index, {
      ...this.faces[index],
      selected: !this.faces[index].selected
    });
  }

  resetSnapshot() {
    this.state = "capture";
    this.photoFile = null;
    this.photoPreviewUrl = null;
    this.faces = [];
  }

  async uploadImage(file: Blob) {
    const formData = new FormData();
    formData.append("file", file);
    const fileObject: FileDoc = (
      await http.post("file", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    ).data;
    return fileObject;
  }

  async save() {
    if (!this.photoFile) return;
    const [photoFile, faceFiles] = await Promise.all([
      this.uploadImage(this.photoFile),
      Promise.all(
        this.selectedFaces.map(face => {
          if (!face.file) return;
          return this.uploadImage(face.file);
        })
      )
    ]);
    this.$emit("photo-upload", {
      photo: photoFile.url,
      faces: faceFiles.map(file => file?.url)
    });
    this.close();
  }

  close() {
    this.stopStream();
    this.$emit("close");
  }

  async getVideoInputDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.cameras = devices.filter(d => d.kind === "videoinput");
    const selectedCamera = this.cameras.find(
      d => d.deviceId === window.localStorage.getItem("selectedCameraDeviceId")
    );
    if (selectedCamera) {
      console.log("found selected camera", selectedCamera.label);
      this.selectedCamera = selectedCamera;
    }
  }

  startStream() {
    const video = this.$refs.video as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({
        video: this.selectedCamera
          ? { deviceId: { exact: this.selectedCamera.deviceId } }
          : { facingMode: "environment" },
        audio: false
      })
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

  async mounted() {
    this.loadModels();
    await this.getVideoInputDevices();
    if (!this.booking.photos?.length) {
      this.state = "capture";
    }
  }
}
</script>

<style lang="scss" scoped>
.full-card {
  margin-left: -24px;
  margin-top: -48px;
  margin-right: -24px;
  height: 281.25px;
  // position: relative;
  // canvas {
  //   position: absolute;
  //   z-index: -1;
  //   left: 0;
  //   top: 0;
  // }
  video,
  canvas,
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px 6px 0 0;
  }
}
// .full-card ::v-deep {
//   .VueCarousel,
//   .VueCarousel-wrapper,
//   VueCarousel-inner,
//   VueCarousel-slide {
//     height: 100%;
//     width: 100%;
//   }
// }
.face-cropped {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  &.disabled {
    opacity: 0.4;
  }
}
.md-progress-bar {
  margin-left: -24px;
  margin-right: -24px;
  width: 100%;
  position: absolute;
}
</style>