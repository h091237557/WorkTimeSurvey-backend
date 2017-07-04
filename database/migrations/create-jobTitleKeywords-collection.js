module.exports = (db) => {
    return db.createCollection("job_title_keywords", {
        capped: true,
        size: 300000,
        max: 1000,
    })
    .then(() => {
        return db.collection('job_title_keywords').createIndex({
            word: 1,
        });
    });
};
