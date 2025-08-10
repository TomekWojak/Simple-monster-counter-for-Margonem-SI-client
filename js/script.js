const mainWindow = document.getElementById("centerbox");
const battleWindow = document.getElementById("battle");
const battleStatus = document.getElementById("battletimer");

const mobs = [
	{
		name: "Shae Phu",
		id: "troop-222512",
		lvl: 30,
		amount: 0,
		img: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/demonszef.gif",
	},
	{
		name: "test1",
		id: "troop-22482",
		lvl: 20,
		amount: 0,
	},
	{
		name: "Władca Rzek",
		id: "troop-264342",
		lvl: 37,
		amount: 0,
		img: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobmag2.gif",
	},
	{
		name: "Gobbos",
		id: "troop-207860",
		lvl: 40,
		amount: 0,
		img: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobsamurai.gif",
	},
	{
		name: "TEST2",
		id: "troop-33291",
		lvl: 50,
		amount: 0,
	},
];

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
	mobBox = document.createElement("div");
	mobBox.classList.add("mob-box");
	mobBox.innerHTML = `<div class="mob-data"><p class="mob-name">${foundObj.name}</p>
                    <p class="mob-lvl-info">Poziom: <span class="mob-lvl"> ${foundObj.lvl}</span></p>
                    <p class="mob-counter-info">Liczba ubić: <span class="mob-counter">${foundObj.amount}</span></p>
                    <p class="mob-date-info">Liczone od: <span class="mob-date">27.01.2025</span></p>
                </div>
                <img src="${foundObj.img}" alt="" class="mob-graphic"></div>`;

	mobBoxes.append(mobBox);
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
						}
					}
				}
			});
		}
	}
});
const resetIfBattleWindowHidden = () => {
	if (battleWindow.style.display === "none" && isFinished === true) {
		isFinished = false;
	}
};

createCounterBtn();
createPanel();
createBottomControls();
setInterval(resetIfBattleWindowHidden, 200);
checkStatus.observe(battleStatus, { childList: true });
