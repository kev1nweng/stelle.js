# stelle.js

**WIP：该库尚未完成，很有可能无法正常工作。**

一个可以在你的网页上生成一片星空的 JS 库。由 Canvas API 驱动。A JavaScript Library that easily creates a starry sky on your webpage. Powered by Canvas API.

## 使用

1. 在 HTML 中创建一个 Canvas 元素；

  ```html
  <canvas id="starry-sky"></canvas>
  ```

2. 引入 Stelle.js；

  ```html
  <script src="path/to/stelle.js"></script>
  ```

3. 实例化并初始化 Stelle 对象，传入 Canvas 元素的选择器以及其他选项；

  ```html
  <script defer>
    // 实例化 Stelle
    const stelle = new Stelle("#starry-sky", {
      useMeteor: false,
      useDistortion: true,
      // ...
    });

    // 初始化
    stelle.init();
  </script>
  ```
