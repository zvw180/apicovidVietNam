const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const fs = require('fs');


async function getdatavn() {
    try {
        const datas = await axios.default({
            method: 'GET',
            url: 'http://ncov.moh.gov.vn/',
            httpsAgent: new (require('https').Agent)({rejectUnauthorized: false})
        });

        const $ = cheerio.load(datas.data);
        let jsonVn = [];
        const selector = '#portlet_corona_trangchu_top_CoronaTrangchuTopPortlet_INSTANCE_RrVAbIFIPL7v > div > div.portlet-content-container > div > section.container > div:nth-child(2) > div:nth-child(2) > div > div.col-lg-12.d-none.d-lg-block > div > div:nth-child(2)';
        $(selector).each((index, el) => {

            const canhiem = $(el).find('.text-danger-new span').text();
            const dieutri = $(el).find('.text-warning1:contains(Đang điều trị) span').text();
            const khoi = $(el).find('.text-success:contains(Khỏi) span').text();
            const tuvong = $(el).find('.text-danger-new1:contains(Tử vong) span').text();


            const dataVn = {
                'vietnam':
                    {
                        'canhiem': canhiem,
                        'dieutri': dieutri,
                        'khoi': khoi,
                        'tuvong': tuvong
                    }

            };
            fs.writeFileSync('data.json', JSON.stringify(dataVn));

            jsonVn.push(dataVn)
        });
        return jsonVn;

    } catch (err) {
        console.error(err);
    }
}


const app = express();
app.get('/api/', async (req, res) => {
    try {
        const vietnam = await getdatavn();
        return res.status(200).json({
            result: vietnam,
        })
    } catch (e) {
        return res.status(500).json({
            e: e.toString(),
        })
    }
});
app.listen(8080, () => {
    console.log("running on port 8080");
});

