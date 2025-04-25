// localStorage.clear();

const timerBtn = document.getElementById("timer-btn");
const timerBtnIcon = timerBtn.querySelector(".timer-path");
const timerBtnText = timerBtn.querySelector(".timer-btn-text");

const timer = document.querySelector(".timer");
const timerName = document.querySelector(".timer-name");
const timeLogList = document.querySelector(".time-log-list");

const timers = JSON.parse(localStorage.getItem("timers")) || [];
console.log(timers); 

// initial loading from localstorage
displayInitialLogs();
function displayInitialLogs() {
    timers.forEach(timer => {
        const li = document.createElement("li");
            li.innerHTML = `
                     <div class="list-item-container">
                        <div class="new-timer-section">
                            <button class="timer-btn new-timer-btn" data-timer-id="${timer.timerId}">
                                <svg class="timer-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" ><path class="timer-path" d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>
                                <span class="timer-btn-text">${timer.timerName}</span>
                            </button>
                        </div>
                        <div class="new-timer-total-section">
                            <span class="timer-total">${timer.timerTotalTime}</span>
                        </div>
                    </div>
            `;
        timeLogList.appendChild(li);

        addEventListnersToNewTimerBtns();
    })
}


let seconds = 0;
let minutes = 0;
let hours = 0;
let intervalId = null;
let timerState = "stopped";

let startTime = null;
let endTime = null;
let totalTime = null;

let newTimerBtnId = null;
let timerCount = 0;

timerBtn.addEventListener("click", () => {
    if(timerState === "stopped") {

        //getting start time
        startTime = new Date();

        // setting timer count
        if(timers.length > 0) {
            const lastLi = document.querySelector(".time-log-list").lastChild;
            const previousTimer = lastLi.querySelector(".timer-btn-text");
            const [text, count] = previousTimer.textContent.split(" ");

            if(Number(count) > 0) {
                timerCount = Number(count) + 1
            }
        }else {
            timerCount++;
        }

        // running timer
        intervalId = setInterval(() => {
            seconds++;
            if(seconds === 60) {
                seconds = 0;
                minutes++;
                if(minutes === 60) {
                    minutes = 0;
                    hours++;
                }
            }
    
            timer.textContent = `${formatWithLeadingZero(hours)}:${formatWithLeadingZero(minutes)}:${formatWithLeadingZero(seconds)}`;
        }, 1000);

        // making necessary changes
        timerState = "started";
        timerBtnText.textContent = "Stop";
        timerBtnIcon.setAttribute("d", "m798-274-60-60q11-27 16.5-53.5T760-440q0-116-82-198t-198-82q-24 0-51 5t-56 16l-60-60q38-20 80.5-30.5T480-800q60 0 117.5 20T706-722l56-56 56 56-56 56q38 51 58 108.5T840-440q0 42-10.5 83.5T798-274ZM520-552v-88h-80v8l80 80ZM792-56l-96-96q-48 35-103.5 53.5T480-80q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-60 18.5-115.5T192-656L56-792l56-56 736 736-56 56ZM480-160q42 0 82-13t75-37L248-599q-24 35-36 75t-12 84q0 116 82 198t198 82ZM360-840v-80h240v80H360Zm83 435Zm113-112Z");
        if(timerName.textContent === ""){
            timerName.textContent = `Timer ${timerCount}`;
        }
        if(seconds === 0 && minutes === 0 && hours === 0 ) {
            const li = document.createElement("li");
            li.innerHTML = `
                    <div class="list-item-container">
                        <div class="new-timer-section">
                            <button class="timer-btn new-timer-btn" data-timer-id="${timerCount}">
                                <svg class="timer-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" ><path class="timer-path" d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>
                                <span class="timer-btn-text">Timer ${timerCount}</span>
                            </button>
                        </div>
                        <div class="new-timer-total-section">
                            <span class="timer-total">-- -- --</span>
                        </div>
                    </div>
            `;
            timeLogList.appendChild(li);
            const timeLogContainer = document.querySelector('.timer-list-section .section-bottom ');
            timeLogContainer.scrollTop = timeLogContainer.scrollHeight;
        }
    }else {

        // stopping timer
        clearInterval(intervalId);

        //getting end time
        endTime = new Date();

        // getting total time
        const timeDiffInSeconds = Math.floor((endTime - startTime) / 1000);
        totalTime = convertSecondsToTimeFormat(timeDiffInSeconds);


        // updating before storing to localstorage
        if(timers.length === 0 || newTimerBtnId === null) {
            console.log("--------new timer additon---------");
            timers.push({
                timerId: timerCount,
                timerName : `Timer ${timerCount}`,
                timeLogs : [
                    {
                        timeLogId: Date.now(),
                        startTime,
                        endTime,
                        totalTime
                    }
                ],
                timerTotalTime: totalTime
            })

            const liToUpdate = document.querySelector(".time-log-list").lastChild;
            const timerTotal = liToUpdate.querySelector(".timer-total");
            timerTotal.textContent = totalTime;

        } else if(timers.length !== 0 && newTimerBtnId !== null) {
            console.log("---------editing existing timer----------");

            timers.forEach(timer => {
                console.log("timer--------->", timer);

                let timerTotalSeconds = 0;
                if(timer.timerId === Number(newTimerBtnId)){
                    timer.timeLogs.push({
                        timeLogId: Date.now(),
                        startTime,
                        endTime,
                        totalTime
                    })

                    // adding all total times//////////
                    timer.timeLogs.forEach(timeLog => {
                        console.log(timeLog)
                        const [h, m, s] = timeLog.totalTime.split(":");
                        const currenTimerTotalSeconds = Number(h) * 36000 + Number(m) * 60 + Number(s);
                        timerTotalSeconds += currenTimerTotalSeconds;
                    })

                    timer.timerTotalTime = convertSecondsToTimeFormat(timerTotalSeconds);
                    console.log("timer total time ------------>",timer.timerTotalTime);

                    
                    const totalTimeContainers = document.querySelectorAll(".timer-total");
                    totalTimeContainers.forEach(totalTimeContainer => {
                        if(totalTimeContainer.textContent === "-- -- --"){
                            totalTimeContainer.textContent = timer.timerTotalTime;
                        }
                    })
                    
                }
            })
        }

        // storing to local storage.
        localStorage.setItem("timers", JSON.stringify(timers));

        // making necessary changes.
        timerState = "stopped";
        timerBtnText.textContent = "Start";
        timerBtnIcon.setAttribute("d", "M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z");
        timerName.textContent = "";
        timer.textContent = "00:00:00";
        newTimerBtnId = null;
        seconds = 0;
        minutes = 0;
        hours = 0;

        addEventListnersToNewTimerBtns(); 
    }
})


function addEventListnersToNewTimerBtns() {
    const newTimerBtns = document.querySelectorAll(".new-timer-btn");
    newTimerBtns.forEach(newTimerBtn => {
        newTimerBtn.addEventListener("click", () => {
            if(timerState !== "started") {

                // storing the id of the clicked btn
                newTimerBtnId = newTimerBtn.dataset.timerId;

                const totalTimeContainer = newTimerBtn.closest(".list-item-container").querySelector(".timer-total");
                const newTime = totalTimeContainer.textContent;

                if(newTime !== "-- -- --") {
                    timer.textContent = newTime;

                    let [h, m, s] = newTime.split(":");
                    seconds = Number(s);
                    minutes = Number(m);
                    hours = Number(h);
                }

                timerName.textContent = `Timer ${newTimerBtnId}`;
                timerBtnText.textContent = "Resume";


                // resetting all timer's total time.
                const allListItems = document.querySelectorAll(".list-item-container");
                allListItems.forEach(item => {
                    const btn = item.querySelector(".new-timer-btn");
                    const totalContainer = item.querySelector(".timer-total");
                    const id = btn.dataset.timerId;

                    if(id === newTimerBtnId) {
                        totalContainer.textContent = "-- -- --";
                    }else {

                        // finding the totaltime of each timer form localstorage and store that value for remaining totals
                        const timerMatched = timers.find(t => t.timerId === Number(id));
                        if(timerMatched) {
                            totalContainer.textContent = timerMatched.timerTotalTime;
                        }
                    }
                })
            }
        })
    })
}

function formatWithLeadingZero(val){
    return val < 10 ? `0${val}` : val
}
function convertSecondsToTimeFormat(totalSeconds){
    let hrs = Math.floor(totalSeconds / 3600); 
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;

    return `${formatWithLeadingZero(hrs)}:${formatWithLeadingZero(mins)}:${formatWithLeadingZero(secs)}`;
}
