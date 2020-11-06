// ██╗  ██╗██████╗ ███╗   ███╗███████╗ █████╗ ██╗
// ██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗██║
// ███████║██║  ██║██╔████╔██║█████╗  ███████║██║
// ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝  ██╔══██║██║
// ██║  ██║██████╔╝██║ ╚═╝ ██║███████╗██║  ██║███████╗
// ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
// Copyright 2019-2020, Hyungyo Seo

let today = new Date();
const Week_KO = ['일', '월', '화', '수', '목', '금', '토']
const navigator_ = new Swiper('.swiper-container');
const settingsModal = $('#settingsModal').html();

// ISO Format 날짜 변환
function ISODate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return year + '-' + month + '-' + day
}

// 화면 그리기
function write(data, index) {
  var keys = Object.keys(data)
    keys.forEach(key => {
      slideId = 'hdm-slide_' + key;
      var date = new Date(key);
      navigator_.appendSlide('<div class="swiper-slide" id="' + slideId + '">' + $('#hdm-slide').html() + '</div>');
      $("#" + slideId + " #date").text(key + '(' + Week_KO[date.getDay()] + ')');

      menu = data[key].Meal[0];
      $("#" + slideId + " #menuBody").text("");
      if (!menu) {
        $("#" + slideId + " #menuBody").text("식단정보가 없습니다.");
      } else if (menu[0] == "") {
        $("#" + slideId + " #menuBody").text("식단정보가 없습니다.");
      } else {
        for (var menuLoc in menu) {
          $("#" + slideId + " #menuBody").append("<li>" + menu[menuLoc] + "</li>");
        }
      }

      $("#" + slideId + " #ttTitle").text(userGrade + "학년 " + userClass + "반 시간표");
      if (data[key].Timetable) {
        tt = data[key].Timetable[userGrade][userClass];
        console.log(tt);
        $("#" + slideId + " #ttBody").text("");
        if (!tt) {
          $("#" + slideId + " #ttBody").text("시간표가 없습니다.");
        } else if (tt.length == 0) {
          $("#" + slideId + " #ttBody").text("시간표가 없습니다.");
        } else {
          for (var ttLoc in tt) {
            $("#" + slideId + " #ttBody").append("<li>" + tt[ttLoc] + "</li>");
          }
        }
      } else {
        $("#" + slideId + " #ttBody").text("시간표가 없습니다.");
      }

      schdl = data[key].Schedule;
      $("#" + slideId + " #schdlBody").text("");
      if (!schdl) {
        $("#" + slideId + " #schdlBody").text("학사일정이 없습니다.");
      } else if (schdl[0] == "") {
        $("#" + slideId + " #schdlBody").text("학사일정이 없습니다.");
      } else {
        for (var schdlLoc in schdl) {
          $("#" + slideId + " #schdlBody").append("<li>" + schdl[schdlLoc] + "</li>");
        }
      }
    })
    if (index !== false) {
      navigator_.slideTo(index, 0);
    } else {
      if (keys.includes(ISODate(today))) {
        navigator_.slideTo(keys.indexOf(ISODate(today)), 0);
      } else {
        $(".swiper-container").hide();
        Swal.fire({
          icon: "error",
          title: "캐시 새로 고침 필요",
          text: "저장되어 있는 캐시가 너무 오래되어 새로 고침이 필요합니다. 계속하려면 장치를 인터넷에 연결한 다음 아래 버튼을 누르십시오.",
          confirmButtonText: "새로 고침",
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
      }
    }
    $("#" + 'hdm-slide_' + keys[0] + " .swiper-btn-priv").addClass('swiper-btn-disabled')
    $("#" + 'hdm-slide_' + keys[keys.length - 1] + " .swiper-btn-next").addClass('swiper-btn-disabled')
    // 변경 버튼 클릭했을 시 모달
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
          softReload();
        }
      });
    })
    // a href="#" 클릭시 화면 상단 이동 방지
    $('a[href="#"]').click(function (e) {
      e.preventDefault();
    });
}

// 데이터 불러오기
function fetchData() {
  $.getJSON("https://static.api.hdml.kr/data.v2.json", function (data) {
    apiData = data;
    write(apiData, false);
  }).done(function () {
    // 로딩 끝나면 화면전환
    $(".lds-ring").animate(
      {
        opacity: "0"
      },
      500
    );
    $(".lds-ring").remove();
    $(".swiper-container").css({ 'visibility': 'visible', 'overflow-y': 'auto' });
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
      text: "장치의 인터넷 연결을 확인해 주세요.",
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

// 데이터를 새로 불러오지 않고 화면만 지운 뒤 다시 그림
function softReload() {
  var current_index = navigator_.activeIndex;
  $(".swiper-wrapper").empty();
  navigator_.update();
  write(apiData, current_index);
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
    navigator_.slidePrev();
  }
  if (e.which == 39) {  // ArrowRight
    navigator_.slideNext();
  }
});

// 서비스워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
