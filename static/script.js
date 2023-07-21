document.addEventListener("DOMContentLoaded", function () {
  let folderPath = "";

  function tileImages() {
    if (!folderPath) return; // フォルダパスが空の場合は処理しない

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
  }

  const loadButton = document.getElementById('loadButton');
  loadButton.addEventListener('click', () => {
    const folderPathInput = document.getElementById('folderPathInput');
    folderPath = folderPathInput.value; // テキストボックスの値（フォルダパス）を取得
    tileImages(); // 画像をロードしてタイリングする
  });

  // リネームボタンが押された時の処理
  document.getElementById('renameButton').addEventListener('click', () => {
    const images = container.querySelectorAll('img');

    const imageNames = Array.from(images).map((image, index) => {
      const fileName = image.getAttribute('alt');
      const extension = fileName.split('.').pop(); // 拡張子
      const newName = `image_${(index + 1).toString().padStart(5, '0')}.${extension}`;
      return { oldName: fileName, newName: newName };
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
        // リネーム後に画像を再ロードしてタイリングする
        tileImages();
      })
      .catch(error => {
        console.error('Error renaming images:', error);
        // エラー処理を行う
      });
  });
});
