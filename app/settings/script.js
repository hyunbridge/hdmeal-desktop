// ██╗  ██╗██████╗ ███╗   ███╗███████╗ █████╗ ██╗
// ██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗██║
// ███████║██║  ██║██╔████╔██║█████╗  ███████║██║
// ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝  ██╔══██║██║
// ██║  ██║██████╔╝██║ ╚═╝ ██║███████╗██║  ██║███████╗
// ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
// Copyright 2019-2020, Hyungyo Seo

const classes = [1,2,3,4,5,6,7,8,9];

const swalDefault = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary btn-lg',
    cancelButton: 'btn btn-lg'
  },
  buttonsStyling: false,
  heightAuto: false,
  confirmButtonText: "확인",
  timer: 1500
})
const swalFatalError = Swal.mixin({
  icon: "error",
  title: "오류",
  heightAuto: false,
  showConfirmButton: false,
  allowEscapeKey : false,
  allowOutsideClick: false
})

// 버튼 활성화
function activate() {
  document.getElementById("save").disabled = false;
  document.getElementById("delete").disabled = false;
}
// 버튼 비활성화
function disactivate() {
  document.getElementById("save").disabled = true;
  document.getElementById("delete").disabled = true;
  return false;
}
$("#save").click(function() {
  disactivate();
  localStorage.Grade = $("#grade option:selected").text();
  localStorage.Class = $("#class option:selected").text();
    swalDefault.fire({
      icon: "success",
      title: "저장했습니다."
    });
  activate();
});
$("#delete").click(function() {
  disactivate();
  localStorage.clear();
  swalDefault.fire({
    icon: "success",
    title: "삭제했습니다.",
    confirmButtonText: "확인"
  });
  activate();
});

// 로딩 끝나면 화면전환
$(document).ready(function() {
  $(".lds-ring").animate(
    {
      opacity: "0"
    },
    500
  );
  $(".lds-ring").remove();
  $(".form").animate(
    {
      opacity: "1"
    },
    500
  );
});

for (var i in classes) {
  $("#class").append(
    '<option value="' +
      classes[i] +
      '반">' +
      classes[i] +
      "</option>"
  );
}
if (localStorage.Grade) {
  $("#grade")
    .val(localStorage.Grade + "학년")
    .prop("selected", true);
}
if (localStorage.Class) {
  $("#class")
    .val(localStorage.Class + "반")
    .prop("selected", true);
}
activate();
console.log(localStorage);
