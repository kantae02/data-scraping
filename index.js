// JavaScript code remains the same
const form = document.getElementById('jobSearchForm');
const submitBtn = document.getElementById('submitBtn');
const jobResults = document.getElementById('jobResults');
// const company = document.getElementById('company')

const jsonArray = []

// company.innerHTML = `<p> ${job.Company}</p>`


form.addEventListener('submit', async (e) => {
    e.preventDefault();


    const apiUrl = 'http://localhost:9000/getJobs';


    try {
        const response = await fetch(`${apiUrl}?title=${document.getElementById('jobRole').value}&location=${document.getElementById('jobLocation').value}&type=${document.getElementById('jobType').value}`, {
        });


        if (response.ok) {
const data = await response.json();
console.log(data)
const jobResultsContainer = document.getElementById('jobResults');

// Clear any previous job results
jobResultsContainer.innerHTML = '';

if (data.jobs.length > 0) {
// Loop through the array and display job data
data.jobs.forEach(job => {
const jobDiv = document.createElement('div');

jobDiv.innerHTML = `
<div id="jobDetailsHead">
  <h2>${job.Company}</h2>
  <div id="titleloc">
    <h3>${job.Title}</h3>
    <p>${job.Location}</p>
  </div>
</div>
<div id="jobDes">
  <p><strong>Job Description</strong> </p>
  <p><strong>Link:</strong> <a href="${job.Link}" target="_blank">Job Link</a></p>
</div>
`;

jobResultsContainer.appendChild(jobDiv);
});
} else {
jobResultsContainer.innerHTML = 'No job data found.';
}
} else {
jobResultsContainer.innerHTML = 'API request failed';
}

    } catch (error) {
        console.log(error)
    }
});