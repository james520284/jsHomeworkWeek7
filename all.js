console.clear();

let originData = [];
const ticketCardArea = document.querySelector('.ticketCard-area');

// 原始資料集
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function (response) {
        originData = response.data.data;
        
        renderData(originData);

        // 篩選資料集
        regionSearch.addEventListener('change',function () {
            filterTickets();
        });
        
        // 新增資料
        addTicketBtn.addEventListener('click',function () {
            addTickets();
        });
        
    })
    .catch(function (error) {
        console.log(error);
})

// 函數：預設載入
function renderData(data) {
    let str = '';
    data.forEach(function (item) {
        str += `<li class="ticketCard">
            <div class="ticketCard-img">
            <a href="#">
                <img src=${item.imgUrl}>
            </a>
            <div class="ticketCard-region">${item.area}</div>
            <div class="ticketCard-rank">${item.rate}</div>
            </div>
            <div class="ticketCard-content">
            <div>
                <h3>
                <a href="#" class="ticketCard-name">${item.name}</a>
                </h3>
                <p class="ticketCard-description">
                ${item.description}
                </p>
            </div>
            <div class="ticketCard-info">
                <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                </p>
                <p class="ticketCard-price">
                TWD <span id="ticketCard-price">$${item.price}</span>
                </p>
            </div>
            </div>
        </li>`;
    });

    if(data.length===0){
        cantFindArea.style.display = 'block';
    }else {
        cantFindArea.style.display = 'none';
    };
    ticketCardArea.innerHTML = str;
    searchResultText.textContent = `本次搜尋共 ${originData.length} 筆資料`;
    showAreaChart();
}

// 函數：篩選資料集
const regionSearch = document.querySelector('.regionSearch');
const searchResultText =document.querySelector('#searchResult-text');
const cantFindArea = document.querySelector('.cantFind-area');

function filterTickets() {
    let filterData= [];
    originData.forEach(function (item) {
    if (item.area == regionSearch.value) {
        filterData.push(item);
    }else if (!regionSearch.value) {
        filterData.push(item);
    }
    });
    renderData(filterData);
    searchResultText.textContent = `本次搜尋共 ${filterData.length} 筆資料`;
}


// 函數：新增資料
const addTicketForm = document.querySelector('.addTicket-form');
const addTicketBtn = document.querySelector('.addTicket-btn');
function addTickets() {
    
    let obj = {
        'area':addTicketForm["景點地區"].value.trim(),
        'description':addTicketForm["套票描述"].value.trim(),
        'group':Number(addTicketForm["套票組數"].value.trim()),
        'id':originData.length,
        'imgUrl':addTicketForm["圖片網址"].value.trim(),
        'name':addTicketForm["套票名稱"].value.trim(),
        'price':Number(addTicketForm["套票金額"].value.trim()),
        'rate':Number(addTicketForm["套票星級"].value.trim())
    };
    // 驗證欄位
    let errorMsg='';
    if (!obj.name) {
    errorMsg = "套票名稱為必填!";
    } else if (!obj.imgUrl) {
    errorMsg = "圖片網址為必填!";
    } else if (!obj.area) {
    errorMsg = "請選擇地區!";
    } else if (obj.price <= 0) {
    errorMsg = "套票金額必須大於 0!";
    } else if (obj.group < 1) {
    errorMsg = "套票組數必須至少為 1!";
    } else if (obj.rate < 1 || obj.rate > 10) {
    errorMsg = "套票星級必須在 1 至 10 之間!";
    } else if (obj.description.length > 100) {
    errorMsg = "套票描述必填，且不能超過 100 字!";
    }
    if(errorMsg){
        alert (errorMsg);
        return;
    }
    // 推送資料
    originData.push(obj);
    console.log(originData);
    renderData(originData);
    addTicketForm.reset();
    regionSearch.value ="";
    showAreaChart();

}


// 函數：顯示地區圖表
function showAreaChart() {
    // 1.先改成新物件 {地區1：數量,地區2：數量,地區3：數量}
    let areaObj = {};
    originData.forEach(function (item) {
        if (!areaObj[item.area]) {
            areaObj[item.area] = 1;
        }else{
            areaObj[item.area] += 1;
        };
    });
    
    // 2.將新物件改成陣列包陣列
    let areaArr = Object.keys(areaObj);
    let areaChartData = [];
    areaArr.forEach(function (item) {
        let areaUnitData = [];
        areaUnitData.push(item);
        areaUnitData.push(areaObj[item]);
        areaChartData.push(areaUnitData);
    });
    console.log(areaChartData);
    
    
    // 3.製成圖表
    const chart = c3.generate({
        size: {
            width: 200,
            height: 300
        },
        data: {
            columns: areaChartData,
            type : 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            
        },
        color: {
                pattern: ['#E68618', '#26C0C7', '#5151D3'] // 自定義顏色
        },
        donut: {
            title: "套票地區比重",
            width: 20,
            label: {
            format: function (value, ratio, id) {
                return ''; // 返回空字符串以隱藏數值
            }
        }
        }
    });
}






