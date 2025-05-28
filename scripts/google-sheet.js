<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>노래 책</title>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    .group-title { font-size: 20px; font-weight: bold; margin-top: 30px; }
    .category-title { font-size: 16px; font-weight: bold; margin-top: 15px; margin-left: 20px; }
    .song-div { display: flex; margin-left: 40px; align-items: center; margin-top: 5px; }
    .album-cover-img { width: 40px; height: 40px; margin-right: 10px; object-fit: cover; }
  </style>
</head>
<body>
  <h1>노래 책</h1>
  <div id="musicList"></div>

  <script>
    let myKey = "1i-sXORfTZXdWSDDFHvdBRd8ZyCDS7f8065af3Ou7Btg";
    let noCover = "https://i.ytimg.com/vi/-Sp9Xyaa3Nk/maxresdefault.jpg";
    let musicbook = [];

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(loadData);

    function loadData() {
      const query = new google.visualization.Query(
        `https://docs.google.com/spreadsheets/d/${myKey}/gviz/tq?tqx=out:json`
      );

      query.send((response) => {
        if (response.isError()) {
          console.error("Query Error:", response.getMessage());
          return;
        }

        const dataTable = response.getDataTable().toJSON();
        const jsonData = JSON.parse(dataTable);
        const cols = ["order", "artist", "song", "genre", "category", "cover_link"];
        musicbook = jsonData.rows.map((row) => {
          let entry = {};
          row.c.forEach((cell, idx) => {
            if (cell && (cell.v || cell.f)) {
              entry[cols[idx]] = cell.f || cell.v;
            }
          });
          return entry;
        });

        displayGroupedSongs(musicbook);
      });
    }

    function displayGroupedSongs(musicList) {
      const container = document.getElementById("musicList");
      container.innerHTML = "";

      const genreGroups = groupBy(musicList, "genre");

      Object.keys(genreGroups).forEach((genre) => {
        const genreTitle = document.createElement("div");
        genreTitle.className = "group-title";
        genreTitle.textContent = `🎵 ${genre}`;
        container.appendChild(genreTitle);

        const categoryGroups = groupBy(genreGroups[genre], "category");

        Object.keys(categoryGroups).forEach((category) => {
          const categoryTitle = document.createElement("div");
          categoryTitle.className = "category-title";
          categoryTitle.textContent = `📂 ${category}`;
          container.appendChild(categoryTitle);

          categoryGroups[category].forEach((song) => {
            const songDiv = document.createElement("div");
            songDiv.className = "song-div";

            const img = document.createElement("img");
            img.src = song.cover_link || noCover;
            img.className = "album-cover-img";

            const info = document.createElement("span");
            info.textContent = `${song.song} - ${song.artist}`;

            songDiv.appendChild(img);
            songDiv.appendChild(info);
            container.appendChild(songDiv);
          });
        });
      });
    }

    function groupBy(array, key) {
      return array.reduce((acc, item) => {
        const value = item[key] || "기타";
        acc[value] = acc[value] || [];
        acc[value].push(item);
        return acc;
      }, {});
    }
  </script>
</body>
</html>




