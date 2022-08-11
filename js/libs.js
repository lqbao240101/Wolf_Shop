const Xuat_Logo = (cuaHang) => {
    let html = ``;
    html = `<img src="${Dia_chi_Dich_vu}/${cuaHang.Ma_so}.png" alt="" style = "width:100px; border-radius: 15px;">`;
    return html;
}

// const Xuat_Cua_Hang = (cuaHang) => {
//     let html = ``;
//     html = `<h1 class="text-primary mb-0">${cuaHang.Ten}</h1>
//             <p class="font-italic text-secondary" style="margin-top: 0px;" id="thongtin">
//             - Phục vụ Quí khách 24/7 <br>`
//     return html;
// }
const Xuat_Footer = (cuaHang) => {
    let html = ``;
    html = `- <i class="fa fa-home" aria-hidden="true"></i> : ${cuaHang.Dia_chi}
    <br>
    - <i class="fa fa-envelope-o" aria-hidden="true"></i> : ${cuaHang.Email} - <i class="fa fa-phone" aria-hidden="true"></i> : <span class="text-primary">${cuaHang.Dien_thoai}</span> `
    return html;
}

const Xuat_San_Pham = (ds, tieuDe, theHien) => {
    let html = `<div class='menu col-12 mb-1'>
    <h3 class="bg-danger text-white p-2 rounded"">${tieuDe} <small>(${ds.length})</small></h3>
    </div>`
    ds.forEach((item, index) => {
        if (item.Giam_gia) {
            html += `
            <div class="menu col-6 col-md-4 col-xl-3 mb-4">
            <div class="card">
            <div class="imgContainer">
                <img class="card-img-top pl-4 pr-4 imgPhone" src="${Dia_chi_Dich_vu}/${item.Ma_so}.png" alt="${item.Ten}">
                </div>
                <div class="card-body pb-3">
                    <h5 class="card-title text-success">${item.Ten}</h5>
                    <p class="card-text text-danger mb-0"><span style='text-decoration: line-through; font-size: 12px'>${Tao_Chuoi_The_hien_So_nguyen_duong(item.Don_gia_Ban)}</span> <sup
                                    style="text-decoration-line: underline;">đ</sup></p>
                            <p class="card-text text-danger">${Tao_Chuoi_The_hien_So_nguyen_duong((item.Don_gia_Ban * 0.8))} <sup
                                    style="text-decoration-line: underline;">đ</sup></p>
                </div>
                <div class="card-footer text-center mb-2">
                    <button class="btn btn-danger btn-sm" onclick = "addtocart('${item.Ma_so}', ${index})"><i class="fa fa-shopping-cart"
                            aria-hidden="true"></i></button>
                    <button class="btn btn-sm btn-outline-primary mr-3" onclick="chiTietSanPham('${item.Ma_so}')"><i class="fa fa-book text-primary"
                            aria-hidden="true"></i></button>
                </div>
                <div class="text-center">
                <div class="btn btn-outline-success countDown mt-0 mb-2"></div>
                </div>
            </div>
        </div>
        `
        } else {
            html += `
            <div class="menu col-6 col-md-4 col-xl-3 mb-4">
            <div class="card">
            <div class="imgContainer">
                <img class="card-img-top pl-4 pr-4 imgPhone" src="${Dia_chi_Dich_vu}/${item.Ma_so}.png" alt="${item.Ten}">
                </div>
                <div class="card-body pb-3">
                    <h5 class="card-title text-success">${item.Ten}</h5>
                    <p class="card-text text-danger">${Tao_Chuoi_The_hien_So_nguyen_duong(item.Don_gia_Ban)} <sup
                            style="text-decoration-line: underline;">đ</sup></p>
                </div>
                <div class="card-footer text-center mb-2">
                    <button class="btn btn-danger btn-sm" onclick = "addtocart('${item.Ma_so}',${index})"><i class="fa fa-shopping-cart"
                            aria-hidden="true"></i></button>
                    <button class="btn btn-sm btn-outline-primary mr-3" onclick="chiTietSanPham('${item.Ma_so}')"><i class="fa fa-book text-primary"
                            aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
`
        }
    })
    theHien.innerHTML = html;
}

function xuatDanhsachGiamgia(ds, tieuDe, theHien, soSp) {
    let soluong = 0;
    let html = `<div class='menu col-12 mb-1'><h3 class="bg-info text-white p-2 rounded"">${tieuDe} <small>(${ds.length})</small></h3></div>`
        for(const item of ds){
        if (item.Giam_gia){
            
        html += `
                <div class="menu col-6 col-md-4 col-xl-3">
                    <div class="card">
                        <div class="imgContainer">    
                            <img class="card-img-top pl-4 pr-4 imgPhone" src="${Dia_chi_Dich_vu}/${item.Ma_so}.png" alt="${item.Ten}">
                        </div>       
                        <div class="card-body pb-3">
                            <h5 class="card-title text-success max-line-2">${item.Ten}</h5>
                            <p class="card-text text-danger mb-0"><span style='text-decoration: line-through; font-size: 12px'>${Tao_Chuoi_The_hien_So_nguyen_duong(item.Don_gia_Ban)}</span> <sup
                                    style="text-decoration-line: underline;">đ</sup></p>
                            <p class="card-text text-danger">${Tao_Chuoi_The_hien_So_nguyen_duong((item.Don_gia_Ban * 0.8))} <sup
                                    style="text-decoration-line: underline;">đ</sup></p>
                        </div>
                        <div class="card-footer text-center mb-1">
                            <button class="btn btn-danger btn-sm" onclick = "addtocart('${item.Ma_so}')"><i class="fa fa-shopping-cart"
                                    aria-hidden="true"></i></button>
                            <button class="btn btn-sm btn-outline-primary mr-3" onclick="chiTietSanPham('${item.Ma_so}')"><i class="fa fa-book text-primary"
                                    aria-hidden="true"></i></button>
                        </div>
                        <div class="text-center">
                        <div class="btn btn-outline-success countDown mt-0 mb-2"></div>
                        </div>
                        </div>
                </div>
        `
        soluong = soluong + 1;
        if(soluong == soSp){
            break;
        }
    }

    }

    theHien.innerHTML = html;

};

function xuatDanhsachBanchay(ds, theHien) {
    ds = ds.slice(0, 3);
    let html = `<ol class="carousel-indicators mt-1 mb-1">
    <li data-target="#carouselId" data-slide-to="0" class="active"></li>
    <li data-target="#carouselId" data-slide-to="1"></li>
    <li data-target="#carouselId" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner" role="listbox" >`;
    ds.forEach((item, index) => {
        html += `<div class="text-center carousel-item ${index == 0 ? 'active' : ''}">
        <img src="${Dia_chi_Dich_vu}/${item.Ma_so}.png" alt="${item.Ten}" loading="lazy"  class="img-fluid">
      </div>`
    })
    html += `</div>
    <a class="carousel-control-prev" href="#carouselId" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselId" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>`
    theHien.innerHTML = html;
}

if (window.Worker) {
    var worker = new Worker("./js/worker_countDownDate.js")
    worker.addEventListener('message', function(e) {
        document.querySelectorAll(".countDown").forEach(p => {
            p.innerHTML = e.data
        })
    }, false)

    function Goi_thong_tin() {
        var countDownDate = new Date("7 1, 2022 15:37:25").getTime();
        worker.postMessage({ 'Ngay': countDownDate })
    }
    Goi_thong_tin()
} else {
    alert('Trình duyệt của bạn không hỗ trợ')
}