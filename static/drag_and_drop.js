document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById('container');
  let draggedTile = null;

  container.addEventListener('dragstart', (event) => {
    draggedTile = event.target;
    event.dataTransfer.setData('text/plain', ''); // 必要なデータをドラッグイベントで渡すためのダミーデータ
    event.target.style.opacity = '0.5'; // ドラッグ中のタイルを半透明にする
  });

  container.addEventListener('dragover', (event) => {
    event.preventDefault(); // ドラッグされた要素を受け入れるために必要
  });

  container.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedTile) {
      const targetTile = event.target.closest('.tile');
      if (targetTile) {
        const index1 = Array.from(container.children).indexOf(draggedTile);
        const index2 = Array.from(container.children).indexOf(targetTile);
        if (index1 >= 0 && index2 >= 0) {
          // タイルの並べ替え
          if (index1 < index2) {
            container.insertBefore(draggedTile, targetTile.nextSibling);
          } else {
            container.insertBefore(draggedTile, targetTile);
          }
        }
      }
      draggedTile.style.opacity = '1'; // ドロップ後、タイルの透明度を戻す
      draggedTile = null;
    }
  });
});
