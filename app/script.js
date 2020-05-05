// ██╗  ██╗██████╗ ███╗   ███╗███████╗ █████╗ ██╗
// ██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗██║
// ███████║██║  ██║██╔████╔██║█████╗  ███████║██║
// ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝  ██╔══██║██║
// ██║  ██║██████╔╝██║ ╚═╝ ██║███████╗██║  ██║███████╗
// ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
// Copyright 2019-2020, Hyungyo Seo

// 스와이퍼 정의
const navigator = new Swiper('.swiper-container', {
  navigation: { // 네비게이션
    nextEl: '.swiper-btn-next', // 오른쪽(다음) 화살표
    prevEl: '.swiper-btn-priv', // 왼쪽(이전) 화살표
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

    load("yesterday", "Yesterday", "어제", userGrade, userClass);
    load("today", "Today", "오늘", userGrade, userClass);
    load("tomorrow", "Tomorrow", "내일", userGrade, userClass);
  }).done(function () {
    // 로딩 끝나면 화면전환
    $(".lds-ring").animate(
      {
        opacity: "0"
      },
      500
    );
    $(".lds-ring").remove();
    $(".swiper-container").css({'visibility': 'visible', 'overflow-y': 'auto'});
    $(".swiper-container").animate(
      {
        opacity: "1"
      },
      500
    );
  }).fail(function (xhr, status, error) {
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
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then(result => {
      if (result.value) {
        fetchData();
      }
    });
  });
}

// 학년/반 정보 불러온 뒤 데이터 로딩 실행
if (localStorage.Grade && localStorage.Class) {
  userGrade = localStorage.Grade;
  userClass = localStorage.Class;
} else {
  localStorage.Grade = 1;
  localStorage.Class = 1;
  userGrade = 1;
  userClass = 1;
}
fetchData();

// 변경 버튼 클릭했을 시 모달
const settingsModal = $('#settingsModal').html();
$('.settingsBtn').click(function () {
  Swal.fire({
    title: '학년/반 정보 변경',
    html: settingsModal,
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
    customClass: {
      confirmButton: 'btn btn-primary btn-lg m-2',
      cancelButton: 'btn btn-secondary btn-lg m-2'
    },
    onBeforeOpen: () => {
      $(".swal2-content #grade").val(userGrade + "학년").prop("selected", true);
      $(".swal2-content #class").val(userClass + "반").prop("selected", true);
    },
    focusCancel: true,
    buttonsStyling: false,
    heightAuto: false,
    reverseButtons: true
  }).then(result => {
    if (result.value) {
      var selectedGrade = $(".swal2-content #grade option:selected").text();
      var selectedClass = $(".swal2-content #class option:selected").text();
      localStorage.Grade = selectedGrade;
      localStorage.Class = selectedClass;
      userGrade = selectedGrade;
      userClass = selectedClass;
      fetchData();
    }
  });
})

// 정보 버튼 클릭했을 시 모달
$('#infoBtn').click(function () {
  Swal.fire({
    title: '흥덕고 급식',
    html: $('#infoModal').html(),
    confirmButtonText: "닫기",
    customClass: {
      confirmButton: 'btn btn-primary btn-lg m-2',
    },
    buttonsStyling: false,
    heightAuto: false
  });
})

// 단축키 할당
$('body').keydown(function (e) {
  if (e.which == 37) {  // ArrowLeft
    navigator.slidePrev();
  }
  if (e.which == 39) {  // ArrowRight
    navigator.slideNext();
  }
});
