require('dotenv').config();

const http = require("http");

const port = normalizePort(process.env.PORT);


const fs = require("fs");
const { resolveSoa } = require("dns");
//Tham chiếu đến thư viện MongoDB
const mongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

//tham chiếu đến thư viện sendMail
const sendMail = require("./sendMail");
//tham chiếu đến thư viện SMS
const sms = require("./sms");

const dich_vu = http.createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    let kq = `Welcome Server Nodejs - Method: ${method} - Url ${url}`;
    
    // //Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (method == "GET") {
        if (url == "/dsDienthoai") {
            mongoClient.connect(uri).then(client => {
                client.db(dbName).collection("Dien_thoai").find({}).toArray().then(result => {
                    res.end(JSON.stringify(result));
                    client.close();
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        } else if (url == "/dsNguoidung") {
            mongoClient.connect(uri).then(client => {
                client.db(dbName).collection("Nguoi_dung").find({}).toArray().then(result => {
                    res.end(JSON.stringify(result));
                    client.close();
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        } else if (url == "/dsMathang") {
            mongoClient.connect(uri).then(client => {
                client.db(dbName).collection("Mat_hang").find({}).toArray().then(result => {
                    res.end(JSON.stringify(result));
                    client.close();
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        } else if (url == "/dsCuahang") {
            mongoClient.connect(uri).then(client => {
                client.db(dbName).collection("Cua_hang").findOne({}).then(result => {
                    res.end(JSON.stringify(result));
                    client.close();
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        } else if (url == "/dsTivi") {
            mongoClient.connect(uri).then(client => {
                client.db(dbName).collection("Tivi").find({}).toArray().then(result => {
                    res.end(JSON.stringify(result));
                    client.close();
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        } else if (url.match("\.png$")) {
            var imagePath = `images/${url}`;
            if (fs.existsSync(imagePath)) {
                let fileStream = fs.createReadStream(imagePath);
                res.writeHead(200, { "Content-Type": "image/png" });
                fileStream.pipe(res);
            } else {
                imagePath = `images/noImg.png`;
                let fileStream = fs.createReadStream(imagePath);
                res.writeHead(200, { "Content-Type": "image/png" });
                fileStream.pipe(res);
            }

        } else {
            kq = `Chưa xét url:${url}`;
            res.end(kq);
        }
    } else if (method == "POST") {
        let noi_dung_nhan = ``
        req.on("data", function (data) {
            noi_dung_nhan += data
        })
        if (url == "/Dangnhap") {
            req.on("end", function () {
                let thongTin = JSON.parse(noi_dung_nhan);
                mongoClient.connect(uri).then(client => {
                    let dieukien = {
                        $and: [
                            { "Ten_Dang_nhap": thongTin.Ten_Dang_nhap },
                            { "Mat_khau": thongTin.Mat_khau }
                        ]
                    }
                    client.db(dbName).collection("Nguoi_dung").findOne(dieukien).then(nguoidung => {
                        let Ket_qua = { "Noi_dung": false };
                        if (nguoidung) {
                            Ket_qua.Noi_dung = {
                                "Ten": nguoidung.Ten,
                                "Nhom": {
                                    "Ma_so": nguoidung.Nhom.Ma_so,
                                    "Ten": nguoidung.Nhom.Ten
                                }
                            };
                            res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                            res.end(JSON.stringify(Ket_qua));
                            client.close();
                        } else {
                            res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                            res.end(JSON.stringify(Ket_qua));
                            client.close();
                        }
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/ThemDienthoai") {
            req.on("end", function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Dien_thoai").insertOne(mobile).then(result => {
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/Image") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                
                // upload img in images ------------------------------
                let kq = saveMedia(img.name, img.src)
                if (kq == "OK") {
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }else{
                    Ket_qua.Noi_dung=false
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }
            })
        } else if (url == "/SuaDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Dien_thoai").updateOne(mobile.condition, mobile.update).then(result => {
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/XoaDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Dien_thoai").deleteOne(mobile).then(result => {
                        
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        }  else if (url == "/ThemTivi") {
            req.on("end", function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Tivi").insertOne(mobile).then(result => {
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/SuaTivi") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Tivi").updateOne(mobile.condition, mobile.update).then(result => {
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/XoaTivi") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Tivi").deleteOne(mobile).then(result => {
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/ThemMathang") {
            req.on("end", function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Mat_hang").insertOne(mobile).then(result => {
                        
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/SuaMathang") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Mat_hang").updateOne(mobile.condition, mobile.update).then(result => {
                        
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/XoaMathang") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Mat_hang").deleteOne(mobile).then(result => {
                        
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/ThemNguoidung") {
            req.on("end", function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Nguoi_dung").insertOne(mobile).then(result => {
                        
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/SuaNguoidung") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Nguoi_dung").updateOne(mobile.condition, mobile.update).then(result => {
                        
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/XoaNguoidung") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                mongoClient.connect(uri).then(client => {
                    client.db(dbName).collection("Nguoi_dung").deleteOne(mobile).then(result => {
                        
                        res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                        res.end(JSON.stringify(Ket_qua));
                        client.close();
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
        } else if (url == "/Dathang") {
            req.on("end", function () {
                let dsDathang = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": [] };
                dsDathang.forEach(item => {
                    mongoClient.connect(uri).then(client => {
                        let dieukien = {
                            "Ma_so": item.key
                        }
                        client.db(`ql_dienthoai`).collection("Dien_thoai").findOne(dieukien).then(dienthoai => {
                            item.dathang.So_Phieu_Dat = dienthoai.Danh_sach_Phieu_Dat.length + 1;
                            dienthoai.Danh_sach_Phieu_Dat.push(item.dathang);
                            let capnhat = {
                                $set: { Danh_sach_Phieu_Dat: dienthoai.Danh_sach_Phieu_Dat }
                            }

                            let obj = {
                                "Ma_so": dienthoai.Ma_so,
                                "Update": true
                            }
                            client.db(`ql_dienthoai`).collection("Dien_thoai").updateOne(dieukien, capnhat).then(result => {
                                if (result.modifiedCount == 0) {
                                    obj.Update = false

                                }
                                Ket_qua.Noi_dung.push(obj);
                                if (Ket_qua.Noi_dung.length == dsDathang.length) {
                                    client.close();
                                    res.end(JSON.stringify(Ket_qua));
                                }
                            })
                        }).catch(() => {
                            client.db(`ql_dienthoai`).collection("Tivi").findOne(dieukien).then(tivi => {
                                item.dathang.So_Phieu_Dat = tivi.Danh_sach_Phieu_Dat.length + 1;
                                tivi.Danh_sach_Phieu_Dat.push(item.dathang);
                                let capnhat = {
                                    $set: { Danh_sach_Phieu_Dat: tivi.Danh_sach_Phieu_Dat}
                                }

                                let obj = {
                                    "Ma_so": tivi.Ma_so,
                                    "Update": true
                                }
                                client.db(`ql_dienthoai`).collection("Tivi").updateOne(dieukien, capnhat).then(result => {
                                    if (result.modifiedCount == 0) {
                                        obj.Update = false
                                    }
                                    Ket_qua.Noi_dung.push(obj);
                                    if (Ket_qua.Noi_dung.length == dsDathang.length) {
                                        client.close();
                                        res.end(JSON.stringify(Ket_qua));
                                    }
                                })
                            }).catch(() => {
                                client.db(`ql_dienthoai`).collection("Mat_hang").findOne(dieukien).then(mathang => {
                                    item.dathang.So_Phieu_Dat = mathang.Danh_sach_Phieu_Dat.length + 1;
                                    mathang.Danh_sach_Phieu_Dat.push(item.dathang);
                                    let capnhat = {
                                        $set: { Danh_sach_Phieu_Dat: mathang.Danh_sach_Phieu_Dat}
                                    }

                                    let obj = {
                                        "Ma_so": mathang.Ma_so,
                                        "Update": true
                                    }
                                    client.db(`ql_dienthoai`).collection("Mat_hang").updateOne(dieukien, capnhat).then(result => {

                                        if (result.modifiedCount == 0) {
                                            obj.Update = false

                                        }
                                        Ket_qua.Noi_dung.push(obj);
                                        if (Ket_qua.Noi_dung.length == dsDathang.length) {
                                            client.close();
                                            res.end(JSON.stringify(Ket_qua));
                                        }
                                    })
                                })
                            })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                })
            })
        } else if (url == "/SendMail") {
            req.on("end", function () {
                let contact = JSON.parse(noi_dung_nhan);
                let from = `huongduongshopbl@gmail.com`;
                let to = contact.to;
                let subject = contact.subject;
                let body = contact.body;
                let Ket_qua = { "Nội dung": true };
                sendMail.Goi_Thu_Lien_he(from, to, subject, body).then(result => {
                    ;
                    res.end(JSON.stringify(Ket_qua));
                }).catch(err => {
                    console.log(err);
                    Ket_qua.Noi_dung = false;
                    res.end(JSON.stringify(Ket_qua));
                })
            })
        } else if (url == "/SMS") {
            req.on("end", function () {
                let sdt = noi_dung_nhan;
                let msg = `Cảm ơn bạn đã đặt hàng của chúng tôi!`;
                sms(sdt, msg).then(result => {
                    res.end(JSON.stringify(result));
                })
                    .catch(err => {
                        res.end(JSON.stringify(err));
                    })
            })
        } else {
            req.on("end", function () {
                let msg = `aaa`
                res.end(msg)
            })
        }
    } else {
        kq = `Dịch vụ không xét phương thức: ${method}`
        res.end(kq);
    }
});

dich_vu.listen(port, console.log(`Dịch vụ thực thi tại địa chỉ: http://localhost:${port}`))

dich_vu.on('error', onError);
dich_vu.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = dich_vu.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

// Upload Media -----------------------------------------------------------------
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Error ...');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

function saveMedia(Ten, Chuoi_nhi_phan) {
    var Kq = "OK"
    try {
        var Nhi_phan = decodeBase64Image(Chuoi_nhi_phan);
        var Duong_dan = "images//" + Ten
        fs.writeFileSync(Duong_dan, Nhi_phan.data);
    } catch (Loi) {
        Kq = Loi.toString()
    }
    return Kq
}