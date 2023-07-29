import os
from flask import Flask, render_template, make_response, send_file, jsonify, request

app = Flask(__name__)


def get_image_files(folder_path):
    image_extensions = [".jpg", ".jpeg", ".png", ".gif"]
    image_files = []
    for filename in os.listdir(folder_path):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            image_files.append(filename)
    return image_files


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/load_images/<path:folder_path>")
def load_images(folder_path):
    image_files = get_image_files(folder_path)
    return jsonify({"images": image_files})


@app.route("/images/<path:folder_path>/<path:image_file>")
def images(folder_path, image_file):
    image_path = os.path.join(folder_path, image_file)

    # Cache-Controlヘッダーを設定して画像を返す
    cache_timeout = 0  # キャッシュの有効期間を0秒に設定（キャッシュを無効化）
    response = make_response(send_file(image_path))
    response.headers[
        "Cache-Control"
    ] = f"max-age={cache_timeout}, no-cache, no-store, must-revalidate"
    return response


@app.route("/rename_images", methods=["POST"])
def rename_images():
    data = request.get_json()
    folder_path = data["folderPath"]
    image_names = data["images"]

    try:
        # 一時的なファイル名を設定
        for image in image_names:
            old_name = image["oldName"]
            old_path = os.path.join(folder_path, old_name)
            temp_old_path = f"{old_path}.tmp"  # 一時的なファイル名を作成
            os.rename(old_path, temp_old_path)  # 一時的なファイル名にリネーム

        # 本命のリネーム処理
        for image in image_names:
            old_name = image["oldName"]
            old_path = os.path.join(folder_path, old_name)
            temp_old_path = f"{old_path}.tmp"  # 一時的なファイル名を作成

            new_name = image["newName"]
            new_path = os.path.join(folder_path, new_name)
            os.rename(temp_old_path, new_path)  # 一時的な拡張子 ".tmp" を除いて本命のリネーム

        return jsonify({"message": "Success"})
    except Exception as e:
        print("Error:", str(e))  # エラー内容を表示
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
