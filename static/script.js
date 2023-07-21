document.addEventListener("DOMContentLoaded", function () {
    let folderPath = "";

    const loadButton = document.getElementById('loadButton');
    loadButton.addEventListener('click', () => {
        const folderPathInput = document.getElementById('folderPathInput');
        folderPath = folderPathInput.value; // テキストボックスの値（フォルダパス）を取得

        fetch(`/load_images/${encodeURIComponent(folderPath)}`)
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('container');
                container.innerHTML = ''; // コンテナ内の内容をクリア

                data.images.forEach(imageFile => {
                    const tile = document.createElement('div');
                    tile.classList.add('tile');
                    tile.draggable = true;
                    tile.innerHTML = `<img src="/images/${encodeURIComponent(folderPath)}/${encodeURIComponent(imageFile)}" alt="${imageFile}" draggable="false">`;
                    container.appendChild(tile);
                });
            })
            .catch(error => console.error('Error fetching images:', error));
    });

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

  // リネームボタンが押された時の処理
  document.getElementById('renameButton').addEventListener('click', () => {
    const images = container.querySelectorAll('img');

    const imageNames = Array.from(images).map((image, index) => {
        const fileName = image.getAttribute('alt');
        const extension = fileName.split('.').pop(); // 拡張子
        return { oldName: fileName, newName: `image_${index + 1}.${extension}` };
    });

    fetch('/rename_images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        folderPath: folderPath,
        images: imageNames
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      // 成功したら処理を行う（リネーム後の画像のリロードなど）
    })
    .catch(error => {
      console.error('Error renaming images:', error);
      // エラー処理を行う
    });
  });

});
