/**
 * 数字分身 Agent - 页面交互逻辑
 */

(function () {
  "use strict";

  /* ===================================================
   *  全屏滚动（第一页 -> 第二页）
   * =================================================== */

  var scrollContainer = document.getElementById("scrollContainer");
  var navDots = document.querySelectorAll(".nav-dot");
  var isScrolling = false;

  /** 缓动函数：easeOutExpo */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /**
   * 平滑滚动到指定页
   * @param {number} index - 目标页索引（从 0 开始）
   */
  window.scrollToPage = function (index) {
    if (isScrolling || !scrollContainer) return;

    var current = scrollContainer.scrollTop;
    var target = scrollContainer.clientHeight * index;
    var distance = target - current;
    var duration = Math.max(400, Math.min(1000, Math.abs(distance) * 2));
    var startTime = null;

    isScrolling = true;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutExpo(progress);

      scrollContainer.scrollTop = current + distance * eased;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        scrollContainer.scrollTop = target;
        isScrolling = false;
      }
    }

    requestAnimationFrame(step);
  };

  /** 根据当前滚动位置更新导航圆点高亮 */
  function updateDots() {
    if (!scrollContainer) return;
    var idx = Math.round(scrollContainer.scrollTop / scrollContainer.clientHeight);
    navDots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === idx);
    });
  }

  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", updateDots, { passive: true });
  }

  /* ===================================================
   *  滚轮拦截：一次滚轮翻一页
   * =================================================== */

  var wheelAccum = 0;

  if (scrollContainer) {
    scrollContainer.addEventListener(
      "wheel",
      function (e) {
        if (scrollContainer.clientHeight * 2 <= scrollContainer.scrollHeight) {
          wheelAccum += e.deltaY;

          if (Math.abs(wheelAccum) > 50) {
            var curIdx = Math.round(scrollContainer.scrollTop / scrollContainer.clientHeight);
            var dir = wheelAccum > 0 ? 1 : -1;
            var next = Math.max(0, Math.min(1, curIdx + dir));

            if (next !== curIdx) {
              scrollToPage(next);
            }

            wheelAccum = 0;
            e.preventDefault();
          }

          clearTimeout(scrollContainer._wt);
          scrollContainer._wt = setTimeout(function () {
            wheelAccum = 0;
          }, 150);
        }
      },
      { passive: false }
    );
  }

  /* ===================================================
   *  视频鼠标跟随进度
   * =================================================== */

  var heroVideo = document.getElementById("heroVideo");
  var videoDuration = 0;
  var targetTime = 0;
  var pendingSeek = false;

  if (heroVideo) {
    heroVideo.src = "/static/girl.mp4?v=" + Date.now();
    heroVideo.load();
  }

  /** 视频加载完成后初始化 */
  function onVideoReady() {
    if (videoDuration > 0 && heroVideo && heroVideo.currentTime !== 0) {
      heroVideo.currentTime = 0;
    }
    targetTime = 0;
    videoDuration = heroVideo ? heroVideo.duration : 0;
  }

  if (heroVideo) {
    heroVideo.addEventListener("loadeddata", onVideoReady);
    heroVideo.addEventListener("loadedmetadata", onVideoReady);
  }

  /** 鼠标水平位置映射到视频播放进度 */
  if (document) {
    document.addEventListener("mousemove", function (e) {
      if (!heroVideo || !isFinite(videoDuration) || videoDuration <= 0) return;

      var ratio = 1 - e.clientX / window.innerWidth;
      targetTime = ratio * videoDuration;
      targetTime = Math.max(0, Math.min(targetTime, videoDuration));

      if (!pendingSeek) {
        pendingSeek = true;
        heroVideo.currentTime = targetTime;
      }
    });
  }

  if (heroVideo) {
    heroVideo.addEventListener("seeked", function () {
      if (!heroVideo) return;
      pendingSeek = false;
      var diff = Math.abs(heroVideo.currentTime - targetTime);
      if (diff > 0.05) {
        pendingSeek = true;
        heroVideo.currentTime = targetTime;
      }
    });
  }

  /* ===================================================
   *  聊天功能
   * =================================================== */

  var chatMessages = document.getElementById("chatMessages");
  var questionInput = document.getElementById("questionInput");
  var sendBtn = document.getElementById("sendBtn");

  if (questionInput) {
    /** 输入框自适应高度 + 发送按钮状态 */
    questionInput.addEventListener("input", function () {
      questionInput.style.height = "auto";
      questionInput.style.height = Math.min(questionInput.scrollHeight, 120) + "px";
      if (sendBtn) sendBtn.disabled = !questionInput.value.trim();
    });

    /** Enter 发送，Shift+Enter 换行 */
    questionInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  /**
   * 追加一条聊天消息
   * @param {string} text - 消息文本
   * @param {string} type - 消息类型: "user" | "agent" | "loading"
   * @returns {string} 消息 DOM 元素的 ID
   */
  function appendMsg(text, type) {
    var id = "msg_" + Date.now();
    var div = document.createElement("div");
    div.id = id;
    div.className = "msg " + type;
    div.textContent = text;

    if (chatMessages) {
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    return id;
  }

  /**
   * 发送用户问题，获取 Agent 回复
   */
  window.sendMessage = async function () {
    if (!questionInput || !sendBtn) return;

    var q = questionInput.value.trim();
    if (!q) return;

    appendMsg(q, "user");
    questionInput.value = "";
    questionInput.style.height = "auto";
    sendBtn.disabled = true;

    var lid = appendMsg("正在思考...", "loading");

    try {
      var fd = new FormData();
      fd.append("question", q);

      var res = await fetch("/api/chat", { method: "POST", body: fd });
      var data = await res.json();

      var loadingEl = document.getElementById(lid);
      if (loadingEl) loadingEl.remove();

      appendMsg(data.answer, "agent");
    } catch (err) {
      var loadingEl = document.getElementById(lid);
      if (loadingEl) loadingEl.remove();
      appendMsg("请求失败: " + err.message, "agent");
    }

    if (sendBtn) sendBtn.disabled = !questionInput.value.trim();
  };

  /**
   * 清空聊天记录
   */
  window.clearChat = function () {
    if (!chatMessages) return;
    chatMessages.innerHTML =
      '<div class="empty-state">' +
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
      "</svg>" +
      "<span>输入 HR 的面试问题开始对话</span>" +
      "</div>";
  };
})();
