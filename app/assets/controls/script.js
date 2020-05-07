// https://github.com/binaryfunt/electron-seamless-titlebar-tutorial/blob/master/src/renderer.js
if (process.platform == 'win32') {  // Windows 전용
    const remote = require('electron').remote;

    const win = remote.getCurrentWindow(); /* Note this is different to the html global `window` variable */

    // When document has loaded, initialise
    document.onreadystatechange = (event) => {
        if (document.readyState == "complete") {
            handleWindowControls();
            // 일단은 Timeout후 보여지도록 해 놓았음
            // TODO: 의도치 않은 애니메이션 동작 하는 이유 확인 후 해결하기
            setTimeout(function () {
                document.getElementById('titlebar').style.display = 'block';

            }, 300);
        }
    };

    window.onbeforeunload = (event) => {
        /* If window is reloaded, remove win event listeners
        (DOM element listeners get auto garbage collected but not
        Electron win listeners as the win is not dereferenced unless closed) */
        win.removeAllListeners();
    }

    function handleWindowControls() {
        // Make minimise/maximise/restore/close buttons work when they are clicked
        document.getElementById('min-button').addEventListener("click", event => {
            win.minimize();
        });

        document.getElementById('max-button').addEventListener("click", event => {
            win.maximize();
        });

        document.getElementById('restore-button').addEventListener("click", event => {
            win.unmaximize();
        });

        document.getElementById('close-button').addEventListener("click", event => {
            win.close();
        });

        // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
        toggleMaxRestoreButtons();
        win.on('maximize', toggleMaxRestoreButtons);
        win.on('unmaximize', toggleMaxRestoreButtons);

        function toggleMaxRestoreButtons() {
            if (win.isMaximized()) {
                document.body.classList.add('maximized');
            } else {
                document.body.classList.remove('maximized');
            }
        }
    }
} else if (process.platform == 'darwin') {
    document.onreadystatechange = (event) => {
        if (document.readyState == "complete") {
            document.getElementById('titlebar').style.display = 'block';
            document.getElementById('window-controls').style.display = 'none';
        }
    };
}
