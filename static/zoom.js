document.addEventListener("DOMContentLoaded", function () {
  const containerSize = 100; // デフォルトのタイルサイズ
  let zoomScale = 1.5;

  function updateTileSize() {
    const container = document.getElementById('container');
    const tiles = container.getElementsByClassName('tile');
    const newTileSize = containerSize * zoomScale + 'px';

    for (const tile of tiles) {
      tile.style.width = newTileSize;
      tile.style.height = newTileSize;
    }
  }

  // 拡大ボタンのイベントリスナー
  document.getElementById('zoomInButton').addEventListener('click', () => {
    zoomScale += 0.5;
    updateTileSize();
  });

  // 縮小ボタンのイベントリスナー
  document.getElementById('zoomOutButton').addEventListener('click', () => {
    zoomScale -= 0.5;
    if (zoomScale < 0.5) zoomScale = 0.5;
    updateTileSize();
  });

});
