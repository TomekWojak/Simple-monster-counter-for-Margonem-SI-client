const mainWindow = document.getElementById("centerbox");
const battleWindow = document.getElementById("battle");
const battleStatus = document.getElementById("battletimer");

let panel;
let mobBox;
let mobBoxes;
let showPanelBtn;
let bottomControls;
let img;

const createCounterBtn = () => {
	showPanelBtn = document.createElement("button");
	showPanelBtn.classList.add("show-panel-btn");
	showPanelBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 491.4C538.5 447.4 576 379.8 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304C64 379.8 101.5 447.4 160 491.4L160 528C160 554.5 181.5 576 208 576L240 576L240 536C240 522.7 250.7 512 264 512C277.3 512 288 522.7 288 536L288 576L352 576L352 536C352 522.7 362.7 512 376 512C389.3 512 400 522.7 400 536L400 576L432 576C458.5 576 480 554.5 480 528L480 491.4zM160 320C160 284.7 188.7 256 224 256C259.3 256 288 284.7 288 320C288 355.3 259.3 384 224 384C188.7 384 160 355.3 160 320zM416 256C451.3 256 480 284.7 480 320C480 355.3 451.3 384 416 384C380.7 384 352 355.3 352 320C352 284.7 380.7 256 416 256z"/></svg>`;

	mainWindow.append(showPanelBtn);

	showPanelBtn.addEventListener("click", showPanel);
};
const showPanel = () => {
	panel.classList.toggle("active");
};
const createPanel = () => {
	if (!panel) {
		panel = document.createElement("div");
		mobBoxes = document.createElement("div");
		panel.classList.add("counter-panel");
		mobBoxes.classList.add("mob-boxes");
		mobBoxes.classList.add("scroll");

		mainWindow.append(panel);
		panel.append(mobBoxes);
	}
};
const createBottomControls = () => {
	bottomControls = document.createElement("div");
	bottomControls.classList.add("controls");
	bottomControls.innerHTML = `
            <button class="close">Zamknij</button>
        `;
	panel.append(bottomControls);
	bottomControls.querySelector(".close").addEventListener("click", showPanel);
};
const createMobBox = (foundObj) => {
	const BOX_ID = `${foundObj.name}-${foundObj.id}`;
	const existingBox = document.querySelector(`[data-monster-id="${BOX_ID}"]`);
	if (existingBox) {
		const quantity = existingBox.querySelector(".mob-counter");
		if (quantity) {
			quantity.textContent = foundObj.amount;
		}
		return;
	}
	const date = setCurrentDate(foundObj);
	mobBox = document.createElement("div");
	mobBox.dataset.monsterId = BOX_ID;
	mobBox.classList.add("mob-box");
	mobBox.innerHTML = `<div class="mob-data"><p class="mob-name">${foundObj.name}</p>
                    <p class="mob-lvl-info">Poziom: <span class="mob-lvl"> ${foundObj.lvl}</span></p>
                    <p class="mob-counter-info">Liczba ubić: <span class="mob-counter">${foundObj.amount}</span></p>
                    <p class="mob-date-info">Liczone od: <span class="mob-date">${date}</span></p>
                </div>
                <img src="${foundObj.img}" alt="" class="mob-graphic"></div>`;
	mobBoxes.append(mobBox);
};
const setCurrentDate = (foundObj) => {
	const currDate = new Date();
	const currDay = currDate.getDate();
	const currMonth = currDate.getMonth() + 1;
	const currYear = currDate.getFullYear();
	foundObj.firstBeat = `${currDay}.${currMonth}.${currYear}`;
	return `${currDay}.${currMonth}.${currYear}`;
};
const checkHp = (node) => {
	const tip = node.getAttribute("tip");
	const tempBox = document.createElement("div");
	tempBox.innerHTML = tip;
	const iElem = tempBox.querySelector("i");
	const HP = iElem.textContent.trim();
	if (HP === "Życie: 0%") {
		return true;
	}
};

let isFinished = false;
const checkStatus = new MutationObserver((entries) => {
	for (const entry of entries) {
		const battleFinished = entry.target.textContent === "Walka zakończona.";
		if (battleFinished) {
			if (isFinished) return;
			isFinished = true;
			const troops = [...battleWindow.getElementsByClassName("troop")];
			troops.forEach((troop) => {
				const isMob = troop.getAttribute("ctip");
				if (isMob === "t_troop2") {
					const isDead = checkHp(troop);
					if (isDead) {
						let id = troop.getAttribute("id");
						const foundMob = mobs.find((mobData) => mobData.id === id);
						if (foundMob) {
							foundMob.amount++;
							createMobBox(foundMob);
							localStorage.setItem("mobData", JSON.stringify(mobs));
						}
					}
				}
			});
		}
	}
});
const resetState = () => {
	if (battleWindow.style.display === "none" && isFinished === true) {
		isFinished = false;
	}
};
const loadMobBoxes = () => {
	const saved = localStorage.getItem("mobData");
	if (saved) {
		const savedMobs = JSON.parse(saved);
		mobs.length = 0;
		mobs.push(...savedMobs);
		savedMobs.forEach((mob) => {
			if (mob.amount > 0) {
				createMobBox(mob);
			}
		});
	}
};
createCounterBtn();
createPanel();
createBottomControls();
loadMobBoxes();
setInterval(resetState, 200);
checkStatus.observe(battleStatus, { childList: true });
