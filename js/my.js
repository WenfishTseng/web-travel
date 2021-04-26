/*  第一個大圖頁面  */
// 填滿使用者螢幕
const elBanner = document.querySelector(".banner");
elBanner.style.height = window.innerHeight + "px";
// 使用者調整畫面填滿螢幕
window.onresize = function () {
  elBanner.style.height = window.innerHeight + "px";
};

//banner的圖片 消失
window.onscroll = function () {
  scrollFunction();
};

// 查看客戶螢幕尺寸 如果滑動大於0.8的高度 banner消失
function scrollFunction() {
  let h = document.documentElement.scrollTop;
  let a = parseInt(elBanner.style.height);
  if (h > a * 0.85) {
    document.querySelector(".banner").style.display = "none";
  }
}

//btn 點選滑動到最上面
var btnGoTop = document.querySelector(".goTop");
btnGoTop.addEventListener(
  "click",
  function () {
    window.scrollTo(0, document.getElementById("header").offsetTop);
  },
  false
);

/* 取得 api 內的資料 */
let data = [];
let zoneData = [];
const URL_TRAVEL =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
const a =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";

// ajax 讀取資料
ajaxGetData("get", URL_TRAVEL, true);

// ajax 讀取資料
function ajaxGetData(method, url, async) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, async);
  //沒有要傳送資料，要傳送null
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log("read all data successfully");
      //取得全部資料
      data = JSON.parse(xhr.responseText).result.records;
      //顯示全部資料列表
      // showAllList(data);
      //製作分頁並顯示資料
      // pagination(data);
      pagination(data, 1);
      console.log("data:" + data);
      //取得只有地區資料
      zoneData = getZoneData(data);
      //顯示於選擇欄位
      showOptZone(zoneData);
      console.log(zoneData);
    } else {
      console.log("read the data failed");
    }
  };
}

//取得地區資料
function getZoneData(list) {
  let zones = [];
  for (let i = 0; i < list.length; i++) {
    let zone = list[i].Zone;
    zones.push(zone);
  }
  console.log("zones: " + zones);
  return filterAry(zones);
}

//過濾重複陣列
function filterAry(list) {
  let result = list.filter((item, index, array) => {
    return array.indexOf(item) === index;
  });
  return result;
}

//選項
const areaSelect = document.getElementById("area");

//顯示地區欄位選項
function showOptZone(list) {
  let options = "";
  for (let i = 0; i < list.length; i++) {
    let opt = "<option value=" + list[i] + ">" + list[i] + " </option>";
    options += opt;
  }
  $("#area").html(
    "<option disabled selected='selected'> - - 請選擇 - - </option>" + options
  );
}

//對select監聽並更新資料
const elAreaSel = document.getElementById("area");
elAreaSel.addEventListener("change", chgAreaSel, false);

// 更新下拉式選單資料
function chgAreaSel(e) {
  let select = e.target.value;
  console.log("choose zone: " + select);
  // 選取選項 渲染list 更換資料頁面
  displaySelectData(select);
  // 熱門區域更新資料
  chgHotZones(select);
  // 取消分頁 btn 改為查看全部資料 btn
  // elPageId.style.display = "none";
  pageShowAllBtn();
}

// 熱門區域更新 將選過的select放入localstorage
// 將 string轉換為json ary  預設四個行政區
let hotZones = JSON.parse(localStorage.getItem("hotZones")) || [
  "苓雅區",
  "三民區",
  "新興區",
  "美濃區",
];

//更新熱門行政區資料
function chgHotZones(select) {
  // 熱門行政區 btn 更新
  if (select !== "") {
    console.log("chgHotZones---zoneData: " + zoneData.length);
    // 判斷 所有高雄地區陣列
    for (let i = 0; i < zoneData.length; i++) {
      // select 和 地區名字相同
      if (select === zoneData[i]) {
        // 判斷 熱門區域陣列 有無存在相同資料 若有刪除
        for (let j = 0; j < hotZones.length; j++) {
          // 先刪除已存在 熱門地區陣列 內的該筆資料  >>　splice
          hotZones.forEach(function (item, index, arr) {
            if (item === zoneData[i]) {
              arr.splice(index, 1);
            }
          });
        }
        // 再把 選取到的地區  加回熱門行政區陣列
        hotZones.push(zoneData[i]);
      }
    }
    console.log("hotZones:    " + hotZones);
    // 將新的 熱門行鎮區 放入 localstorge內
    let hotZonesString = JSON.stringify(hotZones);
    localStorage.setItem("hotZones", hotZonesString);
    // 更新熱門行鎮區的 地區btn 資料
    let newHotZones = JSON.parse(localStorage.getItem("hotZones")) || hotZones;
    // 更新資料 保留4個熱門行政區詞彙
    updateHotZonesData(newHotZones);
  }
}
// 更新資料 4個熱門行政區詞彙
function updateHotZonesData(list) {
  let zonesLength = list.length;
  console.log("zonesLength: " + zonesLength);
  // 新建立一個陣列
  let zones = [];
  // 從最大開始 判斷4個 加入該陣列
  for (let i = zonesLength - 1; i > zonesLength - 5; i--) {
    zones.push(list[i]);
  }
  console.log("updateHotZonesData---zones: " + zones);

  //更新 熱門行政區 btn文字
  document.querySelector(".btn1").value = zones[0];
  document.querySelector(".btn2").value = zones[1];
  document.querySelector(".btn3").value = zones[2];
  document.querySelector(".btn4").value = zones[3];
}

//熱門行政區 點選更換資料頁面
const btn = document.querySelector(".btn1");
btn.addEventListener(
  "click",
  function () {
    // 更新顯示資料
    displaySelectData(btn.value);
    // 更新分頁資料
    pageShowAllBtn();
  },
  false
);

const btn2 = document.querySelector(".btn2");
btn2.addEventListener(
  "click",
  function () {
    displaySelectData(btn2.value);
    pageShowAllBtn();
  },
  false
);

const btn3 = document.querySelector(".btn3");
btn3.addEventListener(
  "click",
  function () {
    displaySelectData(btn3.value);
    pageShowAllBtn();
  },
  false
);

const btn4 = document.querySelector(".btn4");
btn4.addEventListener(
  "click",
  function () {
    displaySelectData(btn4.value);
    pageShowAllBtn();
  },
  false
);

//第一次 顯示全部資料
function showAllList(list) {
  let str = "";
  let dataNum = 0;
  for (let i = 0; i < list.length; i++) {
    document.querySelector(".title").textContent = "高雄區";
    let Ticketinfo = list[i].Ticketinfo || "未提供";
    str += `
    <li data-num='${list[i].dataNum}'><div class='place-img' style='background-image: url("${list[i].Picture1}")'><h4>${list[i].Picdescribe1}</h4></h4><h5>${list[i].Zone}</h5></div><div class='place-info'><div class='row'><div class='small-icon'><img src='images/icons_clock.png' alt='time'></div><span>${list[i].Opentime}</span></div><div class='row'><div class='small-icon'><img src='images/icons_pin.png' alt='location'></div><span>${list[i].Add}</span></div><div class='row third-row'><div class='phone'><div class='small-icon'><img src='images/icons_phone.png' alt='phone'></div><span>${list[i].Tel}</span></div><div class='tag'><div class='small-icon'><img src='images/icons_tag.png' alt='tag'></div><span>${Ticketinfo}</span></div></div></div></li>
    `;

    // let content =
    //   "<li data-num='" +
    //   dataNum +
    //   "'><div class='place-img' style='background-image: url(" +
    //   list[i].Picture1 +
    //   ")'><h4>" +
    //   list[i].Picdescribe1 +
    //   "</h4></h4><h5>" +
    //   list[i].Zone +
    //   "</h5></div><div class='place-info'><div class='row'><div class='small-icon'><img src='images/icons_clock.png' alt='time'></div><span>" +
    //   list[i].Opentime +
    //   "</span></div><div class='row'><div class='small-icon'><img src='images/icons_pin.png' alt='location'></div><span>" +
    //   list[i].Add +
    //   "</span></div><div class='row third-row'><div class='phone'><div class='small-icon'><img src='images/icons_phone.png' alt='phone'></div><span>" +
    //   list[i].Tel +
    //   "</span></div><div class='tag'><div class='small-icon'><img src='images/icons_tag.png' alt='tag'></div><span>" +
    //   Ticketinfo +
    //   "</span></div></div></div></li>";
    // str += content;
    // dataNum += 1;
  }
  document.querySelector(".list").innerHTML = str;
}

//select list更換資料頁面
function displaySelectData(select) {
  if (select !== "") {
    let str = "";
    let dataNum = 0;
    for (let i = 0; i < data.length; i++) {
      if (select === data[i].Zone) {
        document.querySelector(".title").textContent = data[i].Zone;
        let Ticketinfo = data[i].Ticketinfo || "未提供";
        let content =
          "<li data-num='" +
          dataNum +
          "'><div class='place-img' style='background-image: url(" +
          data[i].Picture1 +
          ")'><h4>" +
          data[i].Picdescribe1 +
          "</h4></h4><h5>" +
          data[i].Zone +
          "</h5></div><div class='place-info'><div class='row'><div class='small-icon'><img src='images/icons_clock.png' alt='time'></div><span>" +
          data[i].Opentime +
          "</span></div><div class='row'><div class='small-icon'><img src='images/icons_pin.png' alt='location'></div><span>" +
          data[i].Add +
          "</span></div><div class='row third-row'><div class='phone'><div class='small-icon'><img src='images/icons_phone.png' alt='phone'></div><span>" +
          data[i].Tel +
          "</span></div><div class='tag'><div class='small-icon'><img src='images/icons_tag.png' alt='tag'></div><span>" +
          Ticketinfo +
          "</span></div></div></div></li>";
        str += content;

        dataNum += 1;
      }
      document.querySelector(".list").innerHTML = str;
    }
  }
}

// 第一頁面切換分頁
function pagination(list, nowPage) {
  // 取得全部資料長度
  const dataTotal = list.length;
  console.log("dataTotal: " + dataTotal);
  // 設定顯示畫面數量 預設 5 筆
  const perPage = 6;
  // 總頁數 有可能為餘數 要無條件進位 Math.ceil() 函式會回傳大於等於所給數字的最小整數
  const pageTotal = Math.ceil(dataTotal / perPage);
  // 當前顯示頁數
  let currentPage = nowPage;
  console.log(
    "dataTotal: " +
      dataTotal +
      " / pageTotal: " +
      pageTotal +
      " / currentPage: " +
      currentPage
  );
  // 避免當前頁面比總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
  if (currentPage > pageTotal) currentPage = pageTotal;
  // 當前頁面 第一筆資料 為全部資料數列的第幾筆資料
  const minPageData = currentPage * perPage - perPage + 1;
  const maxPageData = currentPage * perPage;
  // 建立要顯示頁面該頁的資料陣列
  const pageData = [];
  // 用索引判斷資料位置
  list.forEach((item, index) => {
    // 資料索引+1 因為陣列索引從0
    const num = index + 1;
    // 當索引比 minPageData大 且小於 maxPageData 去push資料進入該頁面
    if (num >= minPageData && num <= maxPageData) pageData.push(item);
  });
  // 創建物件 可傳遞資料到其他方法
  const page = {
    pageTotal,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal,
  };
  // 呈現頁面資料
  // displayPageData(pageData);
  showAllList(pageData);
  console.log("pageData: " + pageData);
  // 分頁按鈕
  pageShowBtn(page);
}

// 分頁按鈕點擊切換頁面
function switchPage(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") return;
  const pageNum = e.target.dataset.page;
  pagination(data, pageNum);
  console.log("切換至: " + pageNum);
}

// 對 page 切換分業做監聽
const elPageId = document.getElementById("pageId");
elPageId.addEventListener("click", switchPage);

// 各區資料 製作查看全部資料btn
function pageShowAllBtn() {
  let str = "";
  // 查看全部頁面 btn
  str += `<li class="page-item"><button class="btn btn-light">See All</button></li>`;
  elPageId.innerHTML = str;
  const elAllDataBtn = document.querySelector(".page-item button");
  elAllDataBtn.style.border = "1px solid #dddddd";
  elAllDataBtn.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      console.log("pageShowAllBtn---data: " + data);
      pagination(data, 1);
    },
    false
  );
}

// 製作分頁 btn
function pageShowBtn(page) {
  let str = "";
  // 全部頁數
  const pageTotal = page.pageTotal;
  //判斷前頁btn該如何顯示
  if (page.hasPage) {
    // 還有前一頁面
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${
      Number(page.currentPage) - 1
    }">Previous</a></li>`;
  } else {
    // 沒有前頁面
    str += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
  }

  // 點擊某頁面 按鈕顯示 從1開始
  for (let i = 0; i < pageTotal; i++) {
    let num = i + 1;
    if (Number(parseInt(page.currentPage) === num)) {
      str += `<li class="page-item active"><a class="page-link" href="#" data-page="${num}">${num}</a></li>`;
      console.log("num: " + num);
    } else {
      str += `<li><a href="#" data-page="${num}">${num}</a></li>`;
    }
  }
  // 下一頁如何顯示
  if (page.hasNext) {
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${
      Number(page.currentPage) + 1
    }">Next</a></li>`;
  } else {
    str += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
  }
  elPageId.innerHTML = str;
}
