let cuaHang = {};
let dienThoai = {};
var carts = [];
let tiVi = {};
let matHang = {};
let dsSanpham = [];

apiCuahang().then(result => {
    cuaHang = result;
    document.querySelector("#Th_Logo").innerHTML = Xuat_Logo(cuaHang);
    // document.querySelector("#Th_Cua_hang").innerHTML = Xuat_Cua_Hang(cuaHang);
    document.querySelector("#Th_Footer").innerHTML = Xuat_Footer(cuaHang);
}).catch(err => {
    console.log(err);
})
apiDienthoai().then(result => {
    dienThoai = result;
    apiTivi().then(result => {
        tiVi = result
        apiMathang().then(result => {
            matHang = result;
            dsSanpham = dienThoai.concat(tiVi, matHang);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}).catch(err => {
    console.log(err);
})

const addtocart = (key) => {
    let Ma_so = key;
    // let soluong = Number(document.getElementById(`${Ma_so}soluong`).value);
    let soluong = 1;
    let vt = -1;
    // // Lưu vào sessionStorage
    // if (sessionStorage.getItem("carts") != undefined) {
    if (sessionStorage.getItem("carts")) {
        carts = JSON.parse(sessionStorage.getItem("carts"))
        vt = carts.findIndex(item => item.maso == Ma_so);
    }

    if (vt == -1) {
        let tmp = dsSanpham.find(x => x.Ma_so == Ma_so);
        let cart = {
            maso: Ma_so,
            soluong: soluong,
            ten: tmp?.Ten,
            dongiaban: tmp?.Giam_gia ==true? Number(tmp?.Don_gia_Ban)* 0.8 : Number(tmp?.Don_gia_Ban)
        }
        carts.push(cart) // Thêm 
    } else {
        //carts.splice(vt, 1) // Xóa
        carts[vt].soluong += soluong // Cập nhật lại số lượng
    }

    if (carts.length > 0) {
        sessionStorage.setItem("carts", JSON.stringify(carts))
    } else {
        sessionStorage.removeItem("carts")
    }
    Th_Gio_hang.innerHTML = `<u>${carts.length}</u>`
}

const openCart = () => {
    if (sessionStorage.getItem("carts") != undefined) {
        window.location = `giohang.html`;
    }
}

const Xuat_San_pham_Mua = (carts, Th_Cha) => {
    Th_Cha.innerHTML = ""
    var noi_dung_HTML = ``
    carts.forEach(San_pham_Mua => {
        let thanhTien = San_pham_Mua.soluong * San_pham_Mua.dongiaban
        noi_dung_HTML += `
        <tr>
            <td scope="row text-center" class="border">
                <img src=${Dia_chi_Dich_vu}/${San_pham_Mua.maso}.png class="img-fluid" alt="">
            </td >
            <td>${San_pham_Mua.ten}</td>
            <td class="pl-5">
                <input onchange="soLuong('${San_pham_Mua.maso}',this)" type="number" min = "1" max = "10" value="${San_pham_Mua.soluong}" class="text-right bg-white border border-dark rounded pr-3" />
            </td>
            <td class="text-right">${Tao_Chuoi_The_hien_So_nguyen_duong(San_pham_Mua.dongiaban)}<sup class="text-decoration-underline"> đ</sup>
            </td>
            <td class="text-right">${Tao_Chuoi_The_hien_So_nguyen_duong(thanhTien)}<sup class="text-decoration-underline"> đ</sup>
            </td>
            <td class="text-center" onclick="xoaGiohang('${San_pham_Mua.maso}')"><i class="fa fa-trash-o text-danger" aria-hidden="true">
            </td>
        </tr >
        `
    })
    noi_dung_HTML += `
        <tr>
                <td colspan="6" id="Th_Tong" style="text-align: right;"></td>
                
        </tr>
    `
    Th_Cha.innerHTML = noi_dung_HTML
    tongThanhtien()
}

const tongThanhtien = () => {
    let kq = 0
    carts = JSON.parse(sessionStorage.getItem("carts"))
    carts.forEach(dt => {
        kq += dt.soluong * dt.dongiaban
    })
    Th_Tong.innerHTML = `<strong>Tổng thành tiền:</strong> ${Tao_Chuoi_The_hien_So_nguyen_duong(kq)}<sup> đ</sup>`
}

const soLuong = (maSo, sl) => {
    if(sl.value < 1){
        sl.value = 1;
        alert("Số lượng sản phẩm phải lớn hơn 0!")
        return false;
    }
    else if(sl.value > 10){
        sl.value = 10;
        alert("Số lượng sản phẩm phải nhỏ hơn 10")
        return false;
    }

    let tr = sl.parentNode.parentNode
    let soLuong = sl.value
    let dt = carts.find(x => x.maso == maSo)
    dt.soluong = Number(soLuong)
    sessionStorage.setItem("carts", JSON.stringify(carts))
    let thanhTien = Number(soLuong) * Number(dt.dongiaban)
    tr.children[4].innerHTML = `${Tao_Chuoi_The_hien_So_nguyen_duong(thanhTien)}<sup>đ</sup>`
    tongThanhtien()
}

const xoaGiohang = (maSo) => {
    let vt = carts.findIndex(x => x.maso == maSo)
    carts.splice(vt, 1)
    if (carts.length > 0) {
        sessionStorage.setItem("carts", JSON.stringify(carts))
        Xuat_San_pham_Mua(carts, Th_Carts)
        tongThanhtien()
    } else {
        Th_XoaCarts.click()
    }
}

const datHang = () => {
    let dsDonHang = [];

    if (Th_Ho_ten.value == "" || Th_Dien_thoai.value == "" || Th_Email.value == "" || Th_Dia_chi == "" || Th_Ngay_Giao_hang == "") {
        Th_Thong_bao.innerHTML = '<strong>Vui lòng nhập đầy đủ thông tin giao hàng!</strong>'
        return false
    }

    let email = document.getElementById("Th_Email").value;
    let sdt = document.querySelector("#Th_Dien_thoai").value;

    if (checkEmail(email) == false) {
        return false;
    } else {
        document.getElementById("Th_Thong_bao").innerHTML = `<h3 class="mb-0">GIỎ HÀNG CỦA BẠN</h3>`;
    }

    if (checkSdt(sdt) == false) {
        return false;
    } else {
        document.getElementById("Th_Thong_bao").innerHTML = `<h3 class="mb-0">GIỎ HÀNG CỦA BẠN</h3>`;
    }

    carts = JSON.parse(sessionStorage.getItem("carts"));
    let Khach_hang = {
        "Ho_ten": document.querySelector("#Th_Ho_ten").value,
        "Dien_thoai": sdt,
        "Email": email,
        "Dia_chi": document.querySelector("#Th_Dia_chi").value
    }
    carts.forEach(item => {
        let donDathang = {
            "Ngay_Dat_hang": new Date(),
            "Ngay_Giao_hang": document.querySelector("#Th_Ngay_Giao_hang").value,
            "So_luong": Number(item.soluong),
            "Don_gia_Ban": Number(item.dongiaban),
            "Tien": Number(item.soluong) * Number(item.dongiaban),
            "Trang_thai": "CHUA_GIAO_HANG",
            "Khach_hang": Khach_hang
        };
        let maso = item.maso;
        let donhang = {
            key: maso,
            dathang: donDathang
        }
        dsDonHang.push(donhang);
    })

    apiDathang(dsDonHang).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })

    setTimeout(() => {
        Th_Thong_bao.innerHTML = "<strong>Xác nhận đơn hàng</strong>"
        Th_Chuc_nang.style.display = "none"
        Xuat_Thong_tin_Dat_hang_Thanh_cong(Th_Cha, carts)
    }, 3000)
}

const tinnhan = () => {
    Th_XoaCarts.click();
    let sdt = document.getElementById("SDT").textContent;

    let fix_sdt = sdt.replace('0', '+84');

    apiSMS(fix_sdt).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}

function chiTietSanPham(maSo) {
    let item = dsSanpham.find(x => x.Ma_so == maSo)
    modalTitle.innerHTML = item.Ten;
    let html = `
        <img src="${Dia_chi_Dich_vu}/${item.Ma_so}.png" class="img-fluid">
        <p class="text-danger text-center mt-2">Giá bán: ${Tao_Chuoi_The_hien_So_nguyen_duong(item.Don_gia_Ban)} <sup><u>đ</u></sup></p>
    `
    modalBody.innerHTML = html;
    showModal.click()
}

function xuatSanphamChudeDienthoai(maso, ds) {
    let dsSanphamChude = []

    if (maso != "ALL") {
        dsSanphamChude = ds.filter(x => x.Nhom_Dien_thoai.Ma_so == maso)
        Xuat_San_Pham(dsSanphamChude, "Mobiles", Th_SanPham, );
    } else {
        Xuat_San_Pham(dienThoai, "Mobiles", Th_SanPham, );
    }
}

function xuatSanphamChudeTivi(maso, ds) {
    let dsSanphamChude = []

    if (maso != "ALL") {
        dsSanphamChude = ds.filter(x => x.Nhom_Tivi.Ma_so == maso)
        Xuat_San_Pham(dsSanphamChude, "Tivis", Th_SanPham, );
    } else {
        Xuat_San_Pham(tiVi, "Tivis", Th_SanPham, );
    }
}

function xuatSanphamChudeMathang(maso, ds) {
    let dsSanphamChude = []

    if (maso != "ALL") {
        dsSanphamChude = ds.filter(x => x.Nhom_Mat_hang.Ma_so == maso)
        Xuat_San_Pham(dsSanphamChude, "Foods", Th_SanPham, );
    } else {
        Xuat_San_Pham(matHang, "Foods", Th_SanPham, );
    }
}

function Xuat_Thong_tin_Dat_hang_Thanh_cong(Th_Cha, Ds_Phieu_Dat) {
    let Ho_ten = Th_Ho_ten.value
    let Dien_thoai = Th_Dien_thoai.value
    let Email = Th_Email.value
    let Dia_chi = Th_Dia_chi.value

    let noi_dung_HTML = `
    <div class="col-md-12 table-responsive">
    <table class="table table-sm table-bordered table-striped table-hover">
        <thead class="bg-primary text-white">
            <tr class="text-center">
                <th>Hình</th>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Đơn giá bán</th>
                <th>Thành tiền</th>
            </tr>
        </thead>
    `
    let Tong = 0
    Ds_Phieu_Dat.forEach(Dien_thoai_Mua => {
        let thanhTien = Dien_thoai_Mua.soluong * Dien_thoai_Mua.dongiaban;
        noi_dung_HTML += `
        <tbody>
        <tr>
            <td scope="row" class="text-center">
                <img src=${Dia_chi_Dich_vu}/${Dien_thoai_Mua.maso}.png style="width:80px" />
            </td >
            <td style="vertical-align: middle;" class="text-nowrap">${Dien_thoai_Mua.ten}</td>
            <td style="vertical-align: middle;text-align: right;">${Dien_thoai_Mua.soluong}</td>
            <td style="vertical-align:middle;text-align: right;">${Tao_Chuoi_The_hien_So_nguyen_duong(Dien_thoai_Mua.dongiaban)} <sup><u> đ</u></sup></td>
            <td style="vertical-align: middle;text-align: right;">${Tao_Chuoi_The_hien_So_nguyen_duong(thanhTien)} <sup><u> đ</u></sup></td>
        </tr >
        `
        Tong += Dien_thoai_Mua.soluong * Dien_thoai_Mua.dongiaban
    })
    noi_dung_HTML += `
    <tr>
        <td colspan="5" class="text-right text-danger"><strong>Tổng thành tiền: ${(Tong).toLocaleString(vi-VN)} <sup><u>đ</u></sup> </strong></td>
    </tr>
    <tr>
        <td colspan="5"><h5 class="text-secondary">Chào Quí khách: ${Ho_ten}<br>
        Nhân viên chúng tôi sẽ giao hàng theo địa chỉ: ${Dia_chi}<br>
        Liên hệ quí khách qua số điện thoại: <span id="SDT">${Dien_thoai}</span><br>
        Email: ${Email}
        </h5>     
        </td>
    </tr>
    <tr>
        <td colspan="5" class="text-center"><button class="btn btn-primary" onclick = "tinnhan()">Xác nhận</button></td>
    </tr>    
    
    </tbody>
    </table>
    </div>
    `
    Th_Cha.innerHTML = noi_dung_HTML
}