const puppeteer = require('puppeteer');
const fs = require('fs');

let qno = 1
const question_solution = []
// Function to scrape data for a specific page number
const scrapePage = async (pageNo) => {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: 'new',
        // headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problemset/all/?page=' + pageNo);

    await new Promise(resolve => setTimeout(resolve, 2000));
    const hrefs = await page.evaluate(() => {
        const solutionLinks = [];
        const anchorTags = document.querySelectorAll('a[aria-label="solution"]');
        anchorTags.forEach((anchor) => {
            solutionLinks.push(anchor.getAttribute('href'));
        });
        return solutionLinks;
    });


    for (const href of hrefs) {
        const newPage = await browser.newPage();
        await newPage.goto(`https://leetcode.com${href}`);
        await new Promise(resolve => setTimeout(resolve, 4000));
        const iframeSrcs = await newPage.evaluate(() => {
            const iframes = Array.from(document.querySelectorAll('iframe'));
            return iframes.map(iframe => iframe.getAttribute('src'));
        });

        const solutions = []

        for (const iframeSrc of iframeSrcs) {
            if (iframeSrc.startsWith("https://leetcode.com/playground/")) {
                const iframePage = await browser.newPage();
                await iframePage.goto(iframeSrc);
                await new Promise(resolve => setTimeout(resolve, 2000));
                const code = await iframePage.evaluate(() => {
                    return document.querySelector('textarea[name="lc-codemirror"]').innerText;
                });
                solutions.push(code);
                await iframePage.close();
            }
        }

        if (solutions.length > 0) {
            const modifiedHref = href.replace(/\/[^/]*$/, '');
            await newPage.goto(`https://leetcode.com${modifiedHref}`);
            await new Promise(resolve => setTimeout(resolve, 4000));
            const description = await newPage.evaluate(() => {
                return document.querySelector('meta[name="description"]').content;
            });
            const code = await newPage.evaluate(() => {
                const lines = Array.from(document.querySelectorAll('div.view-line'));
                console.log(lines)
                return lines.map(line => line.textContent).join('\n');
            });
            question_solution.push({
                number: qno,
                question: description.replace(/\u00A0/g,' '),
                code: code.replace(/\u00A0/g,' '),
                solution: solutions
            });
            const jsonData = JSON.stringify(question_solution, null, 2);
            const filePath = './missed2.json';
            fs.writeFileSync(filePath, jsonData);
            console.log(`Saved question ${qno} = ` + `https://leetcode.com${modifiedHref}`);
            qno++;
        }
        await newPage.close();
    }
    await browser.close();
};

(async() => {
    const arr = [55,56]
    for (pageNo of arr) {
        // console.log(pageNo)
        await scrapePage(pageNo);
    }
})();
