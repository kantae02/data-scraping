const { 
    LinkedinScraper,
    relevanceFilter,
    timeFilter,
    typeFilter,
    experienceLevelFilter,
    onSiteOrRemoteFilter,
    events,
} = require('linkedin-jobs-scraper');

const typeMap = {
    F: "Full Time",
    P: "Part Time",
    T: "Training",
    C: "Contract",
    I: "Internship",
}

const getJobs = async (title, location, jobs, type) => {
    const scraper = new LinkedinScraper({
        headless: 'new',
        slowMo: 200,
        args: [
            "--lang=en-GB",
        ],
    });

    scraper.on(events.scraper.data, (data) => {

        console.log(data)
        jobs.push({
            Location: data.location,
            Id:data.jobId,
            Title:data.title,
            Company:data.company ? data.company : "N/A",
            CompanyLink:data.companyLink ? data.companyLink : "N/A",
            CompanyImgLink:data.companyImgLink ? data.companyImgLink : "N/A",
            Place:data.place,
            Date:data.date,
            Link:data.link,
            applyLink: data.applyLink ? data.applyLink : "N/A",
            insights:data.insights,
            type: typeMap[type]
        })
    });
    
    // Emitted once for each scraped page
    scraper.on(events.scraper.metrics, (metrics) => {
        console.log(`Processed=${metrics.processed}`, `Failed=${metrics.failed}`, `Missed=${metrics.missed}`);        
    });

    scraper.on(events.scraper.error, (err) => {
        console.error(err);
    });

    scraper.on(events.scraper.end, () => {
        console.log('All done!');
    });

    // Custom function executed on browser side to extract job description [optional]
    const descriptionFn = () => {
        const description = document.querySelector<HTMLElement>(".jobs-description");
        return description ? description.innerText.replace(/[\s\n\r]+/g, " ").trim() : "N/A";
    }

    // Run queries concurrently    
    await Promise.all([
        // Run queries serially
        scraper.run([
            {
                query: title,
                options: {
                    locations: [[...location].join("")],
                    filters: {
                        // type: [[...type].join("")],
                        onSiteOrRemote: [onSiteOrRemoteFilter.REMOTE, onSiteOrRemoteFilter.HYBRID],
                    },       
                }                                                       
            },
        ], {
            limit: 2,
        }),
    ]);

    // Close browser
    await scraper.close();
    return jobs
};

const express = require('express');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 9000; // Choose a suitable port number

app.use(cors());

app.get('/getJobs', async (req, res) => {

    const jobs = await getJobs(req.query.title, req.query.location, [], req.query.type)
    res.json({jobs})

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
