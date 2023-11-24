let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".model-cont");
let mainCont = document.querySelector(".main-cont");
let textCont = document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let removeBtn = document.querySelector(".delete-btn");
let toolBoxColors = document.querySelectorAll(".color-box");
let toolBoxContainer = document.querySelector(".toolbox-priority-cont");

console.log(toolBoxColors);

let ticketColorClass = "lightPink";
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let addTaskFlag = false; // for button true or false condition for clicking
//add event listeners to button
let removeTaskFlag = false; // for button true or false condition for deleting

let ticketsArr = [];
if (localStorage.getItem("tickets")) {
  ticketsArr = JSON.parse(localStorage.getItem("tickets"));

  ticketsArr.forEach(function (ticket) {
    createTicket(ticket.ticketTask, ticket.ticketColorClass, ticket.ticketID);
  });
}

let colors = ["lightpink", "lightgreen", "lightblue", "black"];
addBtn.addEventListener("click", function (e) {
  addTaskFlag = !addTaskFlag; //true
  console.log(addTaskFlag);
  if (addTaskFlag == true) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});

//2.add tickets -
// add event listeners to modalcont -
// create ticket-get value from text container display in ticket
modalCont.addEventListener("keydown", function (e) {
  let key = e.key;
  // console.log(key);
  if (key == "Shift") {
    console.log("ticket created");

    createTicket(textCont.value, ticketColorClass);
    modalCont.style.display = "none";
    textCont.value = "";
  }
});

function createTicket(ticketTask, ticketColorClass, ticketID) {
  let id = ticketID || shortid(); // generates unique id for ticket
  //   console.log(id)
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");

  ticketCont.innerHTML = `<div class="ticket-color-cont ${ticketColorClass}"></div>
    <div class="ticket-id">
        ${id}
     </div>
  
     <div class="ticket-task">
        ${ticketTask}
     </div>
  
     <div class="ticket-lock">
      <i class="fa fa-lock"></i>
     </div>
     `;

  mainCont.appendChild(ticketCont);
  modalCont.style.display = "none";

  handleLock(ticketCont, id); //lock
  handleRemove(ticketCont, id); //removal
  handleColor(ticketCont, id); //change color bands

  // it will give duplicate tickets
  // ticketsArr.push({ ticketTask, ticketColorClass, ticketID: id });

  //TO REMOVE DUPLICATE NEED TO ADD CONDITION IF TICKETID IS NOT THERE

  if (!ticketID) {
    ticketsArr.push({ ticketTask, ticketColorClass, ticketID: id });
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  }
  // console.log(ticketsArr);
}

//Add tasks according to active color
allPriorityColors.forEach(function (color) {
  // console.log(color);
  color.addEventListener("click", function () {
    console.log(color, "selected");
    allPriorityColors.forEach(function (colorEle) {
      console.log(colorEle, "selected");
      colorEle.classList.remove("active");
    });
    color.classList.add("active");
    ticketColorClass = color.classList[0];
    console.log(ticketColorClass);
  });
});

function handleLock(ticket, id) {
  let ticketLockElem = ticket.querySelector(".ticket-lock");
  let ticketLockIcon = ticketLockElem.children[0];
  // console.log(ticketLockIcon);
  let ticketTaskArea = ticket.querySelector(".ticket-task");

  ticketLockIcon.addEventListener("click", function () {
    // console.log(ticketLockIcon);
    let ticketIdx = getIdx(id); // hxg6n9QYl
    console.log(ticketIdx);
    if (ticketLockIcon.classList.contains(lockClass)) {
      ticketLockIcon.classList.remove(lockClass);
      ticketLockIcon.classList.add(unlockClass);
      //for editing the task
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLockIcon.classList.remove(unlockClass);
      ticketLockIcon.classList.add(lockClass);

      ticketTaskArea.setAttribute("contenteditable", "false");
    }

    ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}

removeBtn.addEventListener("click", function () {
  removeTaskFlag = !removeTaskFlag;
  if (removeTaskFlag == true) {
    alert("Delete button is activated");
    removeBtn.style.color = "red";
  } else {
    alert("Delete button is deactivated");
    removeBtn.style.color = "white";
  }
});

function handleRemove(ticket, id) {
  ticket.addEventListener("click", function () {
    if (!removeTaskFlag) return;

    let ticketIndex = getIdx(id);

    ticket.remove();
    ticketsArr.splice(ticketIndex, 1);
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}

function handleColor(ticket, id) {
  let ticketIndex = getIdx(id);
  let ticketColorBand = ticket.querySelector(".ticket-color-cont");
  console.log(ticketColorBand);
  ticketColorBand.addEventListener("click", function () {
    let currentColor = ticketColorBand.classList[1];
    console.log(currentColor);

    let currentColorIndex = colors.findIndex(function (color) {
      return currentColor === color;
    });
    console.log(currentColorIndex);

    currentColorIndex++;

    // let newTicketColorIndex = currentColorIndex + 1;
    let newTicketColorIndex = currentColorIndex % colors.length;
    // for repeating the loop after last color
    // console.log(newTicketColorIndex);
    let newTicketColorValue = colors[newTicketColorIndex];
    // console.log(newTicketColorValue);

    ticketColorBand.classList.remove(currentColor);
    ticketColorBand.classList.add(newTicketColorValue);

    ticketsArr[ticketIndex].ticketColorClass = newTicketColorValue;
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}
//get all tickets double click on the container

//Get the ticket based on the current color

for (let i = 0; i < toolBoxColors.length; i++) {
  // console.log(toolBoxColors[i].classList[0]);
  toolBoxColors[i].addEventListener("click", function () {
    let selectedToolBoxColor = toolBoxColors[i].classList[0];

    let filteredTickets = ticketsArr.filter(function (ticket) {
      return selectedToolBoxColor === ticket.ticketColorClass;
    });
    console.log(filteredTickets);
    let allTickets = document.querySelectorAll(".ticket-cont");

    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }
    filteredTickets.forEach(function (filterTicket) {
      createTicket(
        filterTicket.ticketTask,
        filterTicket.ticketColorClass,
        filterTicket.ticketID
      );
    });
  });
}

function getIdx(id) {
  let ticketIdx = ticketsArr.findIndex(function (ticketObj) {
    return ticketObj.ticketID === id;
  });

  return ticketIdx;
}
