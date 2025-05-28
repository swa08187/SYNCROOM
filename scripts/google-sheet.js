<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>노래 책 (검색 + 그룹화)</title>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    .search-container {
      margin-bottom: 20px;
    }
    input#searchInput {
      width: 300px;
      padding: 8px;
      font-size: 16px;
    }
    .group-title { font-size: 20px; font-weight: bold; margin-top: 30px; }
    .subgroup-title { font-size: 18px; font-weight: bold; margin-left: 10px; margin-top: 15px; }
    .category-title { font-size: 16px; font-weight: bold; margin-left: 20px; margin-top: 10px; }
    .song-div {
      display: flex;
      margin-left: 40px;
      align-items: center;
      margin-top: 5px;
    }
    .album-cover-img {
      width: 40px; height: 40px; margin-right: 10px; object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 0 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>노래 책</h1>
  <div class="search-container">
    <input type="text" id="searchInput" placeholder="검색어를 입력하세요 (가수, 노래명, 장르, 카테고리)" />
  </div>
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

        const dataTable = response.getDataTable();
        const cols = ["order", "artist", "song", "genre", "category", "cover_link"];
        musicbook = [];

        for (let i = 0; i < dataTable.getNumberOfRows(); i++) {
          let entry = {};
          for (let j = 0; j < cols.length; j++) {
            entry[cols[j]] = dataTable.getValue(i, j) || "";
          }
          if (entry.song) musicbook.push(entry);
        }

        displayGroupedSongs(musicbook);

        // 검색 이벤트 연결
        document.getElementById("searchInput").addEventListener("input", () => {
          const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
          if (!searchTerm) {
            displayGroupedSongs(musicbook);
            return;
          }
          // 필터링
          const filtered = musicbook.filter(item =>
            item.artist.toLowerCase().includes(searchTerm) ||
            item.song.toLowerCase().includes(searchTerm) ||
            item.genre.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
          );
          displayGroupedSongs(filtered);
        });
      });
    }

    // 그룹화 기준: artist → genre → category
    function displayGroupedSongs(musicList) {
      const container = document.getElementById("musicList");
      container.innerHTML = "";

      const artistGroups = groupBy(musicList, "artist");
      if (Object.keys(artistGroups).length === 0) {
        container.textContent = "검색 결과가 없습니다.";
        return;
      }

      Object.keys(artistGroups).forEach((artist) => {
        const artistTitle = document.createElement("div");
        artistTitle.className = "group-title";
        artistTitle.textContent = `👤 ${artist}`;
        container.appendChild(artistTitle);

        const genreGroups = groupBy(artistGroups[artist], "genre");
        Object.keys(genreGroups).forEach((genre) => {
          const genreTitle = document.createElement("div");
          genreTitle.className = "subgroup-title";
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
