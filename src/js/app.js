import { ethers } from "ethers";


/********************* Menu Js **********************/

function windowScroll() {
  const navbar = document.getElementById("navbar");
  if (
    document.body.scrollTop >= 50 ||
    document.documentElement.scrollTop >= 50
  ) {
    navbar.classList.add("nav-sticky");
  } else {
    navbar.classList.remove("nav-sticky");
  }
}

window.addEventListener("scroll", (ev) => {
  ev.preventDefault();
  windowScroll();
});

//
/********************* light-dark js ************************/
//

const btn = document.getElementById("mode");
btn.addEventListener("click", (e) => {
  let theme = localStorage.getItem("theme");
  if (theme == "light" || theme == "") {
    document.body.setAttribute("data-layout-mode", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.removeAttribute("data-layout-mode");
    localStorage.setItem("theme", "light");
  }
});

//
/********************* Swicher js ************************/
//

function toggleSwitcher() {
  var i = document.getElementById("style-switcher");
  if (i.style.left === "-189px") {
    i.style.left = "-0px";
  } else {
    i.style.left = "-189px";
  }
}

function setColor(theme) {
  document.getElementById("color-opt").href = "./css/colors/" + theme + ".css";
  toggleSwitcher(false);
}

// const walletIcon = document.getElementById('connect-wallet');
// walletIcon.addEventListener('click', async() => {
//     if (window.ethereum) {
//         try {
//             await window.ethereum.enable();

//             const provider = new ethers.providers.Web3Provider(window.ethereum);

//             await provider.send("eth_requestAccounts", []);
//             const signer = provider.getSigner();

//             const address = await signer.getAddress();
//             const chainId = await provider.getNetwork().then(network => network.chainId);

//             console.log(`Connected to wallet with address ${address} on chain ${chainId}`);
//         } catch (err) {
//             console.error(err);
//         }
//     } else {
//         window.open("https://metamask.io/download/", "_blank");
//     }
// });