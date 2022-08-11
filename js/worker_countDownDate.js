const formatNoidung = (number) => {
  if(number < 10){
    return "0" + number;
  }
  return number;


}
self.addEventListener('message', function (e) {
    var countDownDate = e.data.Ngay;
    
    // Update the count down every 1 second
    var x = setInterval(function() {
    
      // Get todays date and time
      var now = new Date().getTime();
    
      // Find the distance between now an the count down date
      var distance = countDownDate - now;
    
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
      // Display the result in the element with id="demo"
      var noi_dung= formatNoidung(days) + " ngày - " + formatNoidung(hours) + ":"  + formatNoidung(minutes) + ":" + formatNoidung(seconds);
      self.postMessage(noi_dung)
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        noi_dung="Hết giảm giá";
        self.postMessage(noi_dung);
        self.close();
      }
    }, 1000);
}, false)