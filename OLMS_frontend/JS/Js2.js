document.getElementById("btnRegMem").addEventListener("click",
    function () {
        document.querySelector(".regMemPop").style.display ="flex";
        document.querySelector(".regPubPop").style.display ="none";
    });

document.getElementById("btnRegPub").addEventListener("click",
    function () {
        document.querySelector(".regMemPop").style.display ="none";
        document.querySelector(".regPubPop").style.display ="flex";

    });