// ██╗  ██╗██████╗ ███╗   ███╗███████╗ █████╗ ██╗
// ██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗██║
// ███████║██║  ██║██╔████╔██║█████╗  ███████║██║
// ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝  ██╔══██║██║
// ██║  ██║██████╔╝██║ ╚═╝ ██║███████╗██║  ██║███████╗
// ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
// Copyright 2019-2020, Hyungyo Seo

new Swiper('.swiper-container', {
  navigation: { // 네비게이션
    nextEl: '.swiper-button-next', // 오른쪽(다음) 화살표
    prevEl: '.swiper-button-prev', // 왼쪽(이전) 화살표
  },
  initialSlide: 1,
});

// 데이터 불러오기
function fetchData() {
  $.getJSON("https://static.api.hdml.kr/data.json", function (data) {

    function load(name, date, koname, grade, class_) {

      $("#" + name + " #date").text(koname + ", " + data[date].Date);

      menu = data[date].Meal.Menu;
      $("#" + name + " #menuBody").text("");
      if (!menu) {
        $("#" + name + " #menuBody").text("식단정보가 없습니다.");
      } else if (menu[0] == "") {
        $("#" + name + " #menuBody").text("식단정보가 없습니다.");
      } else {
        for (var menuLoc in menu) {
          $("#" + name + " #menuBody").append("<li>" + menu[menuLoc] + "</li>");
        }
      }

      $("#" + name + " #ttTitle").text(grade + "학년 " + class_ + "반 시간표");
      if (data[date].Timetable) {
        tt = data[date].Timetable[grade][class_];
        console.log(tt);
        $("#" + name + " #ttBody").text("");
        if (!tt) {
          $("#" + name + " #ttBody").text("시간표가 없습니다.");
        } else if (tt.length == 0) {
          $("#" + name + " #ttBody").text("시간표가 없습니다.");
        } else {
          for (var ttLoc in tt) {
            $("#" + name + " #ttBody").append("<li>" + tt[ttLoc] + "</li>");
          }
        }
      } else {
        $("#" + name + " #ttBody").text("시간표가 없습니다.");
      }

      schdl = data[date].Schedule;
      $("#" + name + " #schdlBody").text("");
      if (!schdl) {
        $("#" + name + " #schdlBody").text("학사일정이 없습니다.");
      } else if (schdl[0] == "") {
        $("#" + name + " #schdlBody").text("학사일정이 없습니다.");
      } else {
        for (var schdlLoc in schdl) {
          $("#" + name + " #schdlBody").append("<li>" + schdl[schdlLoc] + "</li>");
        }
      }
    }

    if (localStorage.Grade && localStorage.Class) {
      load("yesterday", "Yesterday", "어제", localStorage.Grade, localStorage.Class);
      load("today", "Today", "오늘", localStorage.Grade, localStorage.Class);
      load("tomorrow", "Tomorrow", "내일", localStorage.Grade, localStorage.Class);
    } else {
      load("yesterday", "Yesterday", "어제", 1, 1);
      load("today", "Today", "오늘", 1, 1);
      load("tomorrow", "Tomorrow", "내일", 1, 1);
    }
  }).done(function(){
    // 로딩 끝나면 화면전환
    $(".lds-ring").animate(
      {
        opacity: "0"
      },
      500
    );
    $(".lds-ring").remove();
    $(".swiper-container").animate(
      {
        opacity: "1"
      },
      500
    );
    $(".swiper-button").delay(1000).animate({ opacity: '0' }, 500);
  }).fail(function(xhr, status, error){
    console.log(xhr);
    console.log(status);
    console.log(error);
    // 로딩 실패했을 경우
    Swal.fire({
      icon: "error",
      title: "불러오지 못했습니다.",
      text: "컴퓨터의 인터넷 연결을 확인해 주세요.",
      confirmButtonText: "다시 시도",
      customClass: {
        actions: 'swal-vertical-buttons',
        confirmButton: 'btn btn-primary btn-lg mb-2'
      },
      buttonsStyling: false,
      heightAuto: false,
      allowEscapeKey : false,
      allowOutsideClick: false
    }).then(result => {
      if (result.value) {
        fetchData();
      }
    });
  });
}
fetchData();