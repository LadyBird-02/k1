const API = "http://localhost:3000"

/* REGISTER */

function registerStudent() {

    fetch(API + "/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name.value,
            roll_no: roll_no.value,
            department: department.value,
            cgpa: cgpa.value,
            skills: skills.value,
            password: password.value
        })
    })
        .then(res => res.json())
        .then(() => {
            alert("Registration successful")
            window.location = "login.html"
        })
}

/* LOGIN */

function login() {

    fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            roll_no: roll_no.value,
            password: password.value
        })
    })
        .then(res => res.json())
        .then(data => {

            localStorage.setItem("token", data.token)

            window.location = "student.html"

        })
}

/* VIEW COMPANIES */

async function getCompanies() {

    const companies = await fetch(API + "/companies")
        .then(res => res.json())

    const student = await fetch(API + "/student/me", {
        headers: { authorization: localStorage.getItem("token") }
    }).then(res => res.json())

    const apps = await fetch(API + "/myapplications", {
        headers: { authorization: localStorage.getItem("token") }
    }).then(res => res.json())

    const appliedCompanies = apps.map(a => a.company)

    let html = ""

    companies.forEach(c => {

        let action = ""

        if (student.cgpa < c.min_cgpa) {
            action = "<button disabled>Not Eligible</button>"
        }
        else if (appliedCompanies.includes(c._id)) {
            action = "<button disabled>Applied</button>"
        }
        else {
            action = `<button onclick="apply('${c._id}','${c.role}')">Apply</button>`
        }

        html += `
<div class="companyCard">

<b>${c.company_name}</b><br>

Role: ${c.role}<br>
Package: ${c.package} LPA<br>
Minimum CGPA: ${c.min_cgpa}<br><br>

${action}

</div>
`
    })

    document.getElementById("companyList").innerHTML = html

}

/* APPLY */

function apply(companyId, role) {

    fetch(API + "/apply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({
            company: companyId,
            role: role
        })
    })
        .then(res => res.json())
        .then(() => {
            alert("Application submitted")
            getCompanies()
        })
}

/* ADD COMPANY */

function addCompany() {

    fetch(API + "/company/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            company_name: company_name.value,
            role: role.value,
            min_cgpa: min_cgpa.value,
            package: package.value
        })
    })
        .then(res => res.json())
        .then(() => alert("Company drive added"))
}

/* VIEW APPLICATIONS */

function getApplications() {

    fetch(API + "/applications")
        .then(res => res.json())
        .then(data => {

            let html = ""

            data.forEach(a => {

                html += `
<div class="companyCard">

<b>${a.company.company_name}</b><br>
Student: ${a.student.name}<br>
Role: ${a.role}<br>
Status: ${a.status}

</div>
`
            })

            document.getElementById("applicationList").innerHTML = html

        })
}