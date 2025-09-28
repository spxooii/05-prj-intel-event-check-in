// Get all necessary DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

const waterList = document.getElementById("waterList");
const zeroList = document.getElementById("zeroList");
const powerList = document.getElementById("powerList");

// Track attendance
let totalAttendees = 0;
const attendanceGoal = 50;
const teamTotals = {
    water: 0,
    zero: 0,
    power: 0
};
let attendees = [];

// Team-specific greeting
const teamGreetings = {
    water: "🌊 Splashing in! Welcome",
    zero: "🌿 Going green! Welcome",
    power: "⚡ Powering up sustainability with"
};

// Save progress in localStorage
if (localStorage.getItem("totalAttendees")) {
    totalAttendees = parseInt(localStorage.getItem("totalAttendees"));
    attendeeCount.textContent = totalAttendees;
    progressBar.style.width = Math.min((totalAttendees / attendanceGoal) * 100, 100) + "%";
}

if (localStorage.getItem("teamTotals")) {
    const savedTeams = JSON.parse(localStorage.getItem("teamTotals"));
    Object.assign(teamTotals, savedTeams);
    waterCount.textContent = teamTotals.water;
    zeroCount.textContent = teamTotals.zero;
    powerCount.textContent = teamTotals.power;
}

if (localStorage.getItem("attendees")) {
    attendees = JSON.parse(localStorage.getItem("attendees"));
    attendees.forEach(att => {
        const li = document.createElement("li");
        const emoji = { water: "🌊", zero: "🌿", power: "⚡" }[att.team];
        li.textContent = `${emoji} ${att.name}`;
        if (att.team === "water") waterList.appendChild(li);
        if (att.team === "zero") zeroList.appendChild(li);
        if (att.team === "power") powerList.appendChild(li);
    });
}

// Form submission handler 
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    if (!name || !team) return; // guard against empty input

    // Increment counts
    totalAttendees++;
    attendeeCount.textContent = totalAttendees;

    teamTotals[team]++;
    document.getElementById(team + "Count").textContent = teamTotals[team];

    // Update progress bar
    const percentage = Math.min((totalAttendees / attendanceGoal) * 100, 100);
    progressBar.style.width = percentage + "%";

    // Greeting
    greeting.textContent = `${teamGreetings[team]}, ${name} from ${teamName}!`;
    greeting.classList.add("success-message");
    greeting.style.display = "block";

    // Celebration at goal
    if (totalAttendees >= attendanceGoal) {
        const winningTeamKey = Object.keys(teamTotals).reduce((a, b) =>
            teamTotals[a] > teamTotals[b] ? a : b
        );
        const winningTeamName = {
            water: "Team Water Wise 🌊",
            zero: "Team Net Zero 🌿",
            power: "Team Renewables ⚡"
        }[winningTeamKey];

        greeting.textContent = `🎉 Goal reached! ${winningTeamName} leads the summit!`;
    }

    // Add attendee to team list
    const li = document.createElement("li");
    const emoji = { water: "🌊", zero: "🌿", power: "⚡" }[team];
    li.textContent = `${emoji} ${name}`;

    if (team === "water") waterList.appendChild(li);
    if (team === "zero") zeroList.appendChild(li);
    if (team === "power") powerList.appendChild(li);

    attendees.push({ name, team });

    // Save to localStorage
    localStorage.setItem("totalAttendees", totalAttendees);
    localStorage.setItem("teamTotals", JSON.stringify(teamTotals));
    localStorage.setItem("attendees", JSON.stringify(attendees));

    // Reset form
    form.reset();
    nameInput.focus();
});
