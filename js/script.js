let mobs = [];
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
	showPanelBtn.innerHTML = `<svg width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
                fill="rgba(0,0,0,0.85)">
                <path
                    d="M160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96z" />
            </svg>`;

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
	if (document.querySelector(`[data-monster-id="${BOX_ID}"]`)) {
		const quantity = mobBox.querySelector(".mob-counter");
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
