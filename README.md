# stelle.js

一个可以在你的网页上生成一片星空的 JS 库。由 Canvas API 驱动。A JavaScript Library that easily creates a starry sky on your webpage. Powered by Canvas API.

## 使用

1. 创建一个 Canvas 元素；

  ```html
  <canvas id="starry-sky"></canvas>
  ```

2. 在 JavaScript 中实例化 Stelle 对象并初始化。

  ```javascript
  import { Stelle } from "path/to/stelle.js";

  // 实例化 Stelle
  const stelle = new Stelle("#starry-sky", {
    useMeteor: false,
    useDistortion: true,
    // ...
  });

  // 初始化
  stelle.init();
  ```
