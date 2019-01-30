// ctx表示canvas绘制上下文；callback表示回调函数
function camvas(ctx, callback) {
  var self = this;
  this.ctx = ctx;
  this.callback = callback;

  // H5的video元素
  var streamContainer = document.createElement('div');
  this.video = document.createElement('video');

  // 设置video元素的一些属性
  this.video.setAttribute('autoplay', '1');
  this.video.setAttribute('playsinline', '1'); // important for iPhones

  this.video.setAttribute('width', 1);
  this.video.setAttribute('height', 1);

  streamContainer.appendChild(this.video);
  document.body.appendChild(streamContainer);

  // 基于浏览器的mediaDevices属性来设置视频源信息
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(
    function(stream) {
      self.video.srcObject = stream;
      // Let's start drawing the canvas!
      self.update();
    },
    function(err) {
      throw err;
    }
  );

  // 当新的视频帧准备就绪，则触发下面操作
  this.update = function() {
    var self = this;
    var last = Date.now();
    var loop = function() {
      // 下面回调函数用于处理当前帧的人脸检测
      var dt = Date.now - last;
      self.callback(self.video, dt);
      last = Date.now();

      // requestAnimationFrame由W3C规范，被目前主流浏览器实现，可以提高调用性能
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };
}
